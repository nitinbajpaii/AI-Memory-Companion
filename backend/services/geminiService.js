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

async function getAIResponse(prompt) {
  const client = getGeminiClient();
  // Use gemini-pro (stable, free, widely available)
  const model = client.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { getAIResponse };
