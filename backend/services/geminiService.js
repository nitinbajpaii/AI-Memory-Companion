const { GoogleGenAI } = require('@google/genai');

// ── AI CONFIGURATION ────────────────────────────────────────────────────────
const AI_CONFIG = {
  model: 'gemini-1.5-flash', // Optimized for speed and low cost
  generationConfig: {
    maxOutputTokens: 180, // Keep responses concise
    temperature: 0.7,     // Balanced creativity and warmth
  }
};

let _ai = null;

const getGeminiClient = () => {
  if (_ai) return _ai;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('GEMINI_API_KEY is missing.');
  }
  _ai = new GoogleGenAI({ apiKey });
  return _ai;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Optimized Text Generation with Selective Retry
 */
async function getAIResponse(prompt, snippet) {
  const ai = getGeminiClient();

  console.log(`[Gemini API] Request: ${snippet || '(no snippet)'}`);

  const MAX_RETRIES = 2; 
  const BASE_DELAY = 2000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: AI_CONFIG.model,
        contents: prompt,
        generationConfig: AI_CONFIG.generationConfig,
      });

      if (!response || !response.text) throw new Error('EMPTY_RESPONSE');

      return { success: true, text: response.text.trim() };

    } catch (error) {
      const status = error.status || error.httpErrorCode || (error.response ? error.response.status : null);
      const msg = (error.message || '').toLowerCase();
      
      // ── 1. Quota Error (429) → DO NOT RETRY ───────────────────────────
      if (status === 429 || msg.includes('quota') || msg.includes('exhausted')) {
        console.error('[Gemini API] Quota exceeded. No retry.');
        return { 
          success: false, 
          errorType: 'QUOTA_EXCEEDED', 
          message: 'Server limit reached, thodi der baad try karo.' 
        };
      }

      // ── 2. Temporary Overload (503) or Network → RETRY ────────────────
      const isRetryable = status === 503 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');

      if (isRetryable && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1);
        console.warn(`[Gemini API] Temporary error. Retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms...`);
        await delay(wait);
        continue;
      }

      // ── 3. Final failure ──────────────────────────────────────────────
      console.error(`[Gemini API] Final failure: ${msg}`);
      return { 
        success: false, 
        errorType: 'TEMPORARY_FAILURE', 
        message: 'Server busy hai, thodi der baad try karo.' 
      };
    }
  }
}

module.exports = { getAIResponse, getGeminiClient };
