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

  console.log('[Gemini API] Request snippet:', snippet || '(no snippet)');
  console.log('[Gemini API] Model: gemini-2.0-flash | Time:', new Date().toISOString());

  const MAX_RETRIES = 3; 
  const BASE_DELAY = 1500; // Start with 1.5s

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error('Empty response from Gemini');
      }

      console.log(`[Gemini API] Success on attempt ${attempt + 1}`);
      return { success: true, text: response.text };

    } catch (error) {
      const status = error.status || error.httpErrorCode || (error.response ? error.response.status : null);
      const msg = (error.message || '').toLowerCase();
      
      console.error(`[Gemini API] Attempt ${attempt + 1} failed:`, msg);

      const isQuota = status === 429 || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource_exhausted');
      const isOverloaded = status === 503 || msg.includes('overloaded') || msg.includes('unavailable');
      const isNetwork = msg.includes('timeout') || msg.includes('network') || msg.includes('econnreset') || msg.includes('fetch failed');

      if ((isQuota || isOverloaded || isNetwork) && attempt < MAX_RETRIES) {
        // Exponential backoff: 1.5s, 3s, 4.5s...
        const wait = BASE_DELAY * (attempt + 1);
        console.warn(`[Gemini API] Retrying in ${wait}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
        await delay(wait);
        continue;
      }

      // If we're here, it's either not retryable or we've exhausted retries
      const errorType = isQuota ? 'QUOTA_EXCEEDED' : (isOverloaded || isNetwork ? 'TEMPORARY_FAILURE' : 'GENERIC_ERROR');
      
      return { 
        success: false, 
        errorType, 
        message: isQuota ? 'Daily limit reached.' : 'AI service is busy.' 
      };
    }
  }

  return { success: false, errorType: 'TEMPORARY_FAILURE', message: 'Maximum retries exceeded.' };
}

module.exports = { getAIResponse, getGeminiClient };
