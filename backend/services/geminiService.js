const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;

const getGeminiClient = () => {
  if (genAI) return genAI;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('GEMINI_API_KEY is missing. Please add it to your Render environment variables.');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

// Delay helper for exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Call Gemini API to generate a response.
 * @param {string} prompt  - Full prompt sent to the model
 * @param {string} snippet - Short user message snippet used only for logging
 */
async function getAIResponse(prompt, snippet) {
  const client = getGeminiClient();

  // ── Model: gemini-1.5-flash-latest (stable, multimodal, free-tier) ──────
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // ── Backend logs ────────────────────────────────────────────────────────
  console.log('[Gemini API] Request snippet:', snippet || '(no snippet)');
  console.log('[Gemini API] Model: gemini-1.5-flash | Time:', new Date().toISOString());

  const MAX_RETRIES = 3;       // up to 3 retries (4 total attempts)
  const BASE_DELAY  = 1000;    // ms — 1s, 2s, 3s backoff
  const FALLBACK_TEXT = 'Main yahin hoon 💜 thoda system slow hai, par main tumhare saath hoon.';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('[Gemini API] Success on attempt', attempt + 1);
      return {
        success: true,
        text: text,
      };
    } catch (error) {
      console.error("Gemini error:", error);
      
      const msg    = (error.message || '').toLowerCase();
      const status = error.status || error.httpErrorCode || (error.response ? error.response.status : null);

      // ── 1. Retryable errors: 429 quota AND 503 overloaded ─────────────────
      const isQuota =
        status === 429 ||
        msg.includes('quota') ||
        msg.includes('rate limit') ||
        msg.includes('rate_limit') ||
        msg.includes('resource_exhausted') ||
        msg.includes('exhausted') ||
        msg.includes('too many requests') ||
        msg.includes('requests per minute') ||
        msg.includes('requests per day') ||
        msg.includes('daily limit') ||
        msg.includes('rpm') ||
        msg.includes('rpd') ||
        (msg.includes('token') && msg.includes('limit'));

      const isOverloaded =
        status === 503 ||
        msg.includes('overloaded') ||
        msg.includes('service unavailable') ||
        msg.includes('unavailable');

      // Retry both quota (429) and overloaded (503) with backoff
      if ((isQuota || isOverloaded) && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1); // 1s, 2s, 3s
        console.warn(
          `[Gemini API] ${isQuota ? '429 Quota' : '503 Overloaded'} — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`
        );
        await delay(wait);
        continue;
      }

      // Final attempt still quota/overloaded → use fallback
      if (isQuota || isOverloaded) {
        console.error(`[Gemini API] Final failure after ${MAX_RETRIES} retries — using fallback. Reason: ${msg}`);
        return { success: true, text: FALLBACK_TEXT, usedFallback: true };
      }

      // ── 2. Temporary network / server errors → retry with backoff ─────────
      const isNetwork =
        (status >= 500 && status !== 503) || // 503 handled above
        msg.includes('timeout') ||
        msg.includes('network') ||
        msg.includes('econnreset') ||
        msg.includes('socket') ||
        msg.includes('fetch failed') ||
        msg.includes('cold start') ||
        msg.includes('internet');

      if (isNetwork && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1); // 1s, 2s, 3s
        console.log(
          `[Gemini API] Network error — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`
        );
        await delay(wait);
        continue;
      }

      // ── 3. Final failure or unrecognized error → fallback, never error ────
      console.error(
        `[Gemini API] Final unrecoverable error after ${attempt + 1} attempt(s) — using fallback. Reason: ${msg}`
      );
      return { success: true, text: FALLBACK_TEXT, usedFallback: true };
    }
  }

  // Should never reach here, but safety net
  return { success: true, text: FALLBACK_TEXT, usedFallback: true };
}

module.exports = { getAIResponse, getGeminiClient };
