const Groq = require('groq-sdk');

let groqClient = null;

const getGroqClient = () => {
  if (groqClient) return groqClient;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is missing');
  groqClient = new Groq({ apiKey });
  return groqClient;
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function getAIResponse(prompt) {
  const groq = getGroqClient();
  const MAX_RETRIES = 2;
  const BASE_DELAY = 1000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log('[Groq] Request sent:', prompt.slice(0, 100));

      // NOTE: openai/gpt-oss-120b is a reasoning model (replaces retired llama-3.1-8b-instant).
      // Reasoning models spend part of the token budget "thinking" before replying, so:
      //   - reasoning_effort: 'low'   → limits internal reasoning tokens, leaves room for the reply
      //   - reasoning_format: 'hidden' → strips reasoning text; only final answer lands in message.content
      //   - max_completion_tokens: 1024 → enough budget for reasoning + a full warm reply at low effort
      // For a lighter/faster option closer to the old 8b tier, try 'openai/gpt-oss-20b'.

      const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_completion_tokens: 1024,
        reasoning_effort: 'low',
        reasoning_format: 'hidden',
      });

      const text = response.choices[0]?.message?.content;
      if (!text) {
        // Log the full raw response so we can see what the model actually returned
        // (finish_reason, usage, reasoning tokens, etc.) instead of a generic error.
        console.error('[Groq] EMPTY_RESPONSE — full raw response:', JSON.stringify(response, null, 2));
        throw new Error('EMPTY_RESPONSE');
      }

      return { success: true, text: text.trim() };

    } catch (error) {
      const status = error.status || error.response?.status;
      const msg = (error.message || '').toLowerCase();

      console.error('[Groq] Error:', error.message);

      if (status === 429 || msg.includes('quota') || msg.includes('limit')) {
        return {
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'Daily AI request limit reached. Please try again tomorrow.',
        };
      }

      const isRetryable = status >= 500 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');
      if (isRetryable && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt);
        console.warn(`[Groq] Temp error. Retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms...`);
        await delay(wait);
        continue;
      }

      return {
        success: false,
        errorType: 'TEMPORARY_FAILURE',
        message: 'AI service temporarily unavailable. Please try again shortly.',
      };
    }
  }
}

module.exports = { getAIResponse };
