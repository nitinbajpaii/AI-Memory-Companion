const { GoogleGenerativeAI } = require('@google/generative-ai');

const AI_CONFIG = {
  model: 'gemini-1.5-flash', // Switching back to 1.5-flash as it's the most compatible with stable SDK
  generationConfig: {
    maxOutputTokens: 180,
    temperature: 0.7,
  }
};

let _ai = null;

const getGeminiClient = () => {
  if (_ai) return _ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY_MISSING');
  _ai = new GoogleGenerativeAI(apiKey); // Correct constructor for @google/generative-ai
  return _ai;
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Optimized AI Request with Quota-Aware Retry Logic
 */
async function getAIResponse(prompt, snippet) {
  const ai = getGeminiClient();
  const MAX_RETRIES = 2;
  const BASE_DELAY = 2000;

  // New Multimodal SDK syntax: model must be initialized via getGenerativeModel
  const model = ai.getGenerativeModel({
    model: AI_CONFIG.model,
    generationConfig: AI_CONFIG.generationConfig,
  });

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Gemini] Request: ${snippet || '...'}`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error('EMPTY_RESPONSE');

      return { success: true, text: text.trim() };

    } catch (error) {
      const status = error.status || error.httpErrorCode || error.response?.status;
      const msg = (error.message || '').toLowerCase();

      // ── 1. QUOTA / RATE LIMIT (429) → STOP IMMEDIATELY ────────────────
      if (status === 429 || msg.includes('quota') || msg.includes('limit')) {
        console.error('[Gemini] Quota Exceeded. Aborting.');
        return { success: false, errorType: 'QUOTA_EXCEEDED', message: 'Limit reached. Thodi der baad try karo.' };
      }

      // ── 2. RETRYABLE (503/Network/Timeout) ───────────────────────────
      const isRetryable = status === 503 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');
      
      if (isRetryable && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.warn(`[Gemini] Temp Error. Retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms...`);
        await delay(wait);
        continue;
      }

      // ── 3. FINAL FAILURE ──────────────────────────────────────────────
      console.error(`[Gemini] Final Failure: ${msg}`);
      return { success: false, errorType: 'SERVICE_ERROR', message: 'Server busy hai. Try again later.' };
    }
  }
}

module.exports = { getAIResponse, getGeminiClient };
