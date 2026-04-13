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

  // ── Model: use gemini-2.5-flash (current free-tier, 2026) ──────────────
  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // ── Duplicate-call audit log ────────────────────────────────────────────
  console.log('[Gemini API] Gemini request sent:', snippet || '(no snippet)');
  console.log('[Gemini API] Model: gemini-2.5-flash | Time:', new Date().toISOString());

  const MAX_RETRIES = 2;
  const BASE_DELAY  = 1000; // ms

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      console.log('[Gemini API] Success on attempt', attempt + 1);
      return {
        success: true,
        text: result.response.text(),
      };
    } catch (err) {
      const msg    = (err.message || '').toLowerCase();
      const status = err.status || err.httpErrorCode || null;

      console.error(`[Gemini API] Attempt ${attempt + 1} failed — status: ${status} | msg: ${err.message}`);

      // ── 1. Quota / Rate-limit errors → return immediately, no retry ───────
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

      if (isQuota) {
        console.warn('[Gemini API] Quota / rate-limit hit — NOT retrying.');
        return {
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'Daily AI request limit reached. Please try again tomorrow.',
        };
      }

      // ── 2. Auth / bad-request errors → return immediately, no retry ───────
      const isInvalid =
        status === 400 ||
        status === 403 ||
        msg.includes('api key') ||
        msg.includes('invalid key') ||
        msg.includes('permission denied');

      if (isInvalid) {
        console.error('[Gemini API] Auth / invalid request — NOT retrying.');
        return {
          success: false,
          errorType: 'INVALID_REQUEST',
          message: 'There is an issue with the AI configuration. Please contact support.',
        };
      }

      // ── 3. Temporary network / server errors → retry with backoff ─────────
      const isNetwork =
        status >= 500 ||
        msg.includes('timeout') ||
        msg.includes('network') ||
        msg.includes('econnreset') ||
        msg.includes('socket') ||
        msg.includes('fetch failed') ||
        msg.includes('unavailable');

      if (isNetwork && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt); // 1 s, 2 s
        console.log(`[Gemini API] Network error — retrying in ${wait}ms (attempt ${attempt + 2}/${MAX_RETRIES + 1})`);
        await delay(wait);
        continue;
      }

      // ── 4. Fallback after retries exhausted or unrecognised error ─────────
      console.error('[Gemini API] Final failure — returning TEMPORARY_FAILURE.');
      return {
        success: false,
        errorType: isNetwork ? 'TEMPORARY_FAILURE' : 'UNKNOWN_ERROR',
        message: 'AI service temporarily unavailable. Please try again shortly.',
      };
    }
  }
}

module.exports = { getAIResponse };
