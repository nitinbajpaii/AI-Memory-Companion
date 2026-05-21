const { OpenAI } = require('openai');

let _ai = null;

const getOpenAIClient = () => {
  if (_ai) return _ai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY_MISSING');
  _ai = new OpenAI({ apiKey });
  return _ai;
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Optimized AI Request with Quota-Aware Retry Logic
 */
async function getAIResponse(prompt, snippet) {
  const ai = getOpenAIClient();
  const MAX_RETRIES = 2;
  const BASE_DELAY = 2000;
  const fallbackMessage = 'Main yahin hoon 💜 thoda system slow hai, par main tumhare saath hoon.';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[OpenAI] Request: ${snippet || '...'}`);
      
      const response = await ai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 180,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content;

      if (!text) throw new Error('EMPTY_RESPONSE');

      return { success: true, text: text.trim() };

    } catch (error) {
      const status = error.status || error.response?.status;
      const msg = (error.message || '').toLowerCase();

      // ── 1. QUOTA / RATE LIMIT (429) → STOP IMMEDIATELY ────────────────
      if (status === 429 || msg.includes('quota') || msg.includes('limit')) {
        console.error('[OpenAI] Quota Exceeded. Returning fallback.');
        return { success: true, text: fallbackMessage };
      }

      // ── 2. RETRYABLE (503/Network/Timeout) ───────────────────────────
      const isRetryable = status >= 500 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');
      
      if (isRetryable && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.warn(`[OpenAI] Temp Error. Retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms...`);
        await delay(wait);
        continue;
      }

      // ── 3. FINAL FAILURE ──────────────────────────────────────────────
      console.error(`[OpenAI] Final Failure: ${msg}`);
      return { success: true, text: fallbackMessage };
    }
  }
}

module.exports = { getAIResponse, getOpenAIClient };
