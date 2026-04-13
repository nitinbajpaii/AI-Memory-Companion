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

async function getAIResponse(prompt) {
  const client = getGeminiClient();
  // gemini-2.0-flash: current free-tier model (2026)
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const maxRetries = 2;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return {
        success: true,
        text: result.response.text()
      };
    } catch (error) {
      console.error(`[Gemini API] Attempt ${attempt + 1} failed:`, error.message);
      
      const errorMessage = error.message.toLowerCase();
      
      // Determine error type
      let errorType = "UNKNOWN_ERROR";
      let userMessage = "I'm unable to respond right now due to service limits. Please try again shortly.";
      
      if (error.status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('exhausted')) {
         errorType = "QUOTA_EXCEEDED";
         userMessage = "Today's AI request limit has been reached. Please try again after quota reset.";
         // Do not retry on hard quota limits
         return {
           success: false,
           errorType,
           message: userMessage
         };
      } else if (errorMessage.includes('timeout') || errorMessage.includes('network') || error.status >= 500) {
         errorType = "NETWORK_ERROR";
         userMessage = "I'm having trouble connecting right now. Let me try again...";
      } else if (errorMessage.includes('api key') || error.status === 400 || error.status === 403) {
         errorType = "INVALID_REQUEST";
         // Do not retry on bad requests / invalid keys
         return {
           success: false,
           errorType,
           message: "There is an issue with the AI configuration. Please check API keys."
         };
      }
      
      if (attempt < maxRetries && errorType === "NETWORK_ERROR") {
        const waitTime = baseDelay * Math.pow(2, attempt); // 1s, 2s
        console.log(`[Gemini API] Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      
      // Fallback response after all retries exhausted or non-retriable error
      return {
        success: false,
        errorType,
        message: userMessage
      };
    }
  }
}

module.exports = { getAIResponse };
