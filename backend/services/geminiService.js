const { GoogleGenAI } = require('@google/genai');

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON CLIENT  —  one instance for the entire process lifetime
// ─────────────────────────────────────────────────────────────────────────────
let _ai = null;

const getGeminiClient = () => {
  if (_ai) return _ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('GEMINI_API_KEY is missing. Please add it to your environment variables.');
  }
  _ai = new GoogleGenAI({ apiKey });
  return _ai;
};

// Delay helper for exponential backoff
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─────────────────────────────────────────────────────────────────────────────
// TEXT GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call Gemini API to generate a text response.
 * @param {string} prompt  - Full prompt sent to the model
 * @param {string} snippet - Short user message snippet used only for logging
 */
async function getAIResponse(prompt, snippet) {
  const ai = getGeminiClient();

  // ── Backend logs ────────────────────────────────────────────────────────
  console.log('[Gemini API] Request snippet:', snippet || '(no snippet)');
  console.log('[Gemini API] Model: gemini-2.0-flash | Time:', new Date().toISOString());

  const MAX_RETRIES  = 3;     // up to 3 retries (4 total attempts)
  const BASE_DELAY   = 1000;  // ms — 1s, 2s, 3s backoff
  const FALLBACK_TEXT = 'Main yahin hoon 💜 thoda system slow hai, par main tumhare saath hoon.';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // ── New SDK: ai.models.generateContent ──────────────────────────────
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const text = response.text;

      console.log('[Gemini API] Success on attempt', attempt + 1);
      return { success: true, text };

    } catch (error) {
      console.error('[Gemini API] Error on attempt', attempt + 1, ':', error.message);

      const msg    = (error.message || '').toLowerCase();
      const status = error.status || error.httpErrorCode ||
                     (error.response ? error.response.status : null);

      // ── 1. Retryable: 429 quota AND 503 overloaded ────────────────────
      const isQuota =
        status === 429 ||
        msg.includes('quota') || msg.includes('rate limit') ||
        msg.includes('rate_limit') || msg.includes('resource_exhausted') ||
        msg.includes('exhausted') || msg.includes('too many requests') ||
        msg.includes('requests per minute') || msg.includes('requests per day') ||
        msg.includes('daily limit') || msg.includes('rpm') || msg.includes('rpd') ||
        (msg.includes('token') && msg.includes('limit'));

      const isOverloaded =
        status === 503 ||
        msg.includes('overloaded') || msg.includes('service unavailable') ||
        msg.includes('unavailable');

      if ((isQuota || isOverloaded) && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1);
        console.warn(
          `[Gemini API] ${isQuota ? '429 Quota' : '503 Overloaded'} — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`
        );
        await delay(wait);
        continue;
      }

      // Final attempt still quota/overloaded → fallback
      if (isQuota || isOverloaded) {
        console.error(`[Gemini API] Final failure after ${MAX_RETRIES} retries — using fallback. Reason: ${msg}`);
        return { success: true, text: FALLBACK_TEXT, usedFallback: true };
      }

      // ── 2. Temporary network / server errors → retry ──────────────────
      const isNetwork =
        (status >= 500 && status !== 503) ||
        msg.includes('timeout') || msg.includes('network') ||
        msg.includes('econnreset') || msg.includes('socket') ||
        msg.includes('fetch failed') || msg.includes('cold start') ||
        msg.includes('internet');

      if (isNetwork && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1);
        console.log(`[Gemini API] Network error — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
        await delay(wait);
        continue;
      }

      // ── 3. Final / unrecognized → fallback, never throw ──────────────
      console.error(
        `[Gemini API] Final unrecoverable error after ${attempt + 1} attempt(s) — using fallback. Reason: ${msg}`
      );
      return { success: true, text: FALLBACK_TEXT, usedFallback: true };
    }
  }

  // Safety net — should never reach here
  return { success: true, text: FALLBACK_TEXT, usedFallback: true };
}

module.exports = { getAIResponse, getGeminiClient };
