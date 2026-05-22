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
      console.log("Groq request sent:", prompt.slice(0, 100));
      
      const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      const text = response.choices[0]?.message?.content;

      if (!text) throw new Error('EMPTY_RESPONSE');

      return { success: true, text: text.trim() };

    } catch (error) {
      const status = error.status || error.response?.status;
      const msg = (error.message || '').toLowerCase();

      console.error("Groq error:", error);

      if (status === 429 || msg.includes('quota') || msg.includes('limit')) {
        return { 
          success: false, 
          errorType: "QUOTA_EXCEEDED", 
          message: "Daily AI request limit reached. Please try again tomorrow." 
        };
      }

      const isRetryable = status >= 500 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');
      
      if (isRetryable && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * Math.pow(2, attempt);
        console.warn(`Groq temp error. Retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms...`);
        await delay(wait);
        continue;
      }

      return { 
        success: false, 
        errorType: "TEMPORARY_FAILURE", 
        message: "AI service temporarily unavailable. Please try again shortly." 
      };
    }
  }
}

module.exports = { getAIResponse };
