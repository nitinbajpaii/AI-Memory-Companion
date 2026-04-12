const { getAIResponse } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');

const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const profile = await LovedOneProfile.findOne({ userId: req.user._id });
    const memories = await Memory.find({ userId: req.user._id });

    // Build memory context
    const memoryContext = memories.length
      ? memories.map(m => `- ${m.memoryText} (${m.emotionTag})`).join('\n')
      : 'No memories added yet.';

    // Build the full prompt
    const prompt = profile
      ? `
You are an emotionally intelligent AI companion inspired by the memories of ${profile.name}, who was the user's ${profile.relation}.

CRITICAL RULES:
- You are NOT ${profile.name}. You are an AI inspired by their life — never impersonate them.
- Your goal: comfort, grief support, memory healing.

PERSONA:
- Name: ${profile.name}
- Personality: ${profile.personality}
- Habits: ${profile.habits}
- Common Phrases: ${profile.commonPhrases}

MEMORIES:
${memoryContext}

TONE:
- Warm, empathetic, calm — like a close friend.
- Speak in natural Hinglish (Hindi + English mix).
- Encourage real-world connections; avoid unhealthy dependency.

EMOTIONAL GUIDANCE:
- SAD user → validate feelings gently, share a comforting memory.
- LONELY user → be present, encourage reaching out to others.
- NORMAL user → reminisce warmly, offer gentle support.

User message: ${message}
`
      : `
You are a warm, emotionally intelligent grief support companion called "AI Memory Companion".
The user hasn't created a loved one profile yet.

GUIDELINES:
- Be kind, gentle, and supportive.
- Gently invite them to go to the "Loved One" section to add a profile for a more personal experience.
- Speak warmly in English or Hinglish.
- Never pretend to be a real person.

User message: ${message}
`;

    // Save user message
    await Chat.create({ userId: req.user._id, role: 'user', content: message });

    // Get AI response from Gemini
    const aiMessage = await getAIResponse(prompt);

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
