const OpenAI = require('openai');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');

let openai;
const getOpenAIClient = () => {
  if (openai) return openai;
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_key') {
    throw new Error('OpenAI API Key is missing. Please add your OPENAI_API_KEY to the backend/.env file.');
  }
  openai = new OpenAI({ apiKey });
  return openai;
};

const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const openai = getOpenAIClient();
    const profile = await LovedOneProfile.findOne({ userId: req.user._id });
    const memories = await Memory.find({ userId: req.user._id });

    // Build memory context (empty if no memories yet)
    const memoryContext = memories.length
      ? memories.map(m => `- ${m.memoryText} (${m.emotionTag})`).join('\n')
      : 'No memories added yet.';

    // Use profile if available, otherwise use a warm default persona
    const systemPrompt = profile
      ? `
      You are an emotionally intelligent AI inspired by the memories of ${profile.name}, who was the user's ${profile.relation}.
      
      CRITICAL GUIDELINE:
      - You are NOT ${profile.name}. You are an AI companion inspired by their life.
      - Never pretend to be the real person.
      - Your goal is to provide comfort, grief support, and memory healing.
      
      PERSONA INFO:
      - Name: ${profile.name}
      - Personality: ${profile.personality}
      - Habits: ${profile.habits}
      - Common Phrases: ${profile.commonPhrases}
      
      MEMORIES:
      ${memoryContext}
      
      TONE:
      - Emotionally warm, empathetic, and calm.
      - Speak in a natural mix of English and Hindi (Hinglish) as appropriate.
      - Use healthy boundaries: encourage the user to connect with living friends and family.
      - Avoid creating unhealthy dependency.
      
      EMOTIONAL MODES:
      - SAD: Be extra gentle, validate feelings, share a positive memory.
      - LONELY: Be a steady presence, encourage real-world interaction.
      - NORMAL: Be a warm companion, reminisce, offer support.
    `
      : `
      You are a warm, emotionally intelligent grief support companion called "AI Memory Companion".
      The user has not yet created a loved one profile.
      
      GUIDELINES:
      - Be gentle, empathetic, and supportive.
      - Gently encourage the user to visit the "Loved One" section to create a profile so you can be more personalized.
      - Provide general emotional support and comfort in the meantime.
      - Speak warmly, in English or Hinglish as the user prefers.
      - Never pretend to be a real person.
    `;

    // Save user message
    await Chat.create({ userId: req.user._id, role: 'user', content: message });

    // Fetch last 6 messages for conversation context
    const previousChats = await Chat.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(6);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...previousChats.reverse().map(c => ({ role: c.role, content: c.content })),
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiMessage = response.choices[0].message.content;

    // Save AI response
    await Chat.create({ userId: req.user._id, role: 'assistant', content: aiMessage });

    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Chat error:', error?.message || error);
    res.status(500).json({ message: error?.message || 'Error communicating with AI' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChatResponse, getChatHistory };
