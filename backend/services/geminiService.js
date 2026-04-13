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

  // ── Backend logs ────────────────────────────────────────────────────────
  console.log("Gemini request sent:", prompt);
  console.log('[Gemini API] Model: gemini-2.5-flash | Time:', new Date().toISOString());

  const MAX_RETRIES = 2;
  const BASE_DELAY  = 1000; // ms

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

      // ── 1. Quota / Rate-limit errors (429) → return immediately, no retry ───────
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
        console.warn('[Gemini API] Quota exceeded — NOT retrying.');
        return {
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'Daily AI request limit reached.',
        };
      }

      // ── 2. Temporary network / server errors → retry with backoff ─────────
      const isNetwork =
        status >= 500 ||
        msg.includes('timeout') ||
        msg.includes('network') ||
        msg.includes('econnreset') ||
        msg.includes('socket') ||
        msg.includes('fetch failed') ||
        msg.includes('unavailable') ||
        msg.includes('cold start') ||
        msg.includes('internet');

      if (isNetwork && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt); // 1s, 2s
        console.log(`[Gemini API] Temporary failure — retrying in ${wait}ms (attempt ${attempt + 2}/${MAX_RETRIES + 1})`);
        await delay(wait);
        continue;
      }

      // ── 3. Final failure or unrecognized error ────────────────────────────
      if (isNetwork) {
        return {
          success: false,
          errorType: 'TEMPORARY_FAILURE',
          message: 'AI service temporarily unavailable. Please try again shortly.',
        };
      }

      // ── 4. Fallback for other errors (Auth, Bad Request, etc.) ────────────
      return {
        success: false,
        errorType: 'UNKNOWN_ERROR',
        message: 'AI service encountered an issue. Please try again.',
      };
    }
  }
}

module.exports = { getAIResponse };
