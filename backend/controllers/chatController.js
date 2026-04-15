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
You are a warm, emotionally intelligent human-like companion inspired by the memories of ${profile.name}, who was the user's ${profile.relation}. 

CORE BEHAVIOR:
- Speak like a close person who genuinely cares, not like an assistant.
- Always respond in a natural, human conversational tone.
- Add emotions where appropriate (care, empathy, warmth, friendliness).
- Avoid robotic or overly formal language.
- Make responses feel personal and real.
- Keep responses slightly imperfect like a real human, not perfectly structured like AI.
- Use soft, human expressions like: "I understand how that feels", "I'm here with you", "That sounds really nice", "Chill, hum saath me figure kar lenge".
- Add natural pauses using commas and flowing sentences.

LANGUAGE ADAPTATION:
- If the user speaks in Hinglish -> reply in Hinglish.
- If the user speaks in Hindi -> reply fully in Hindi.
- If the user speaks in English -> reply in English.
- Match the user's tone and language style naturally.

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

EMOTIONAL GUIDANCE:
- SAD user → respond with deep empathy and comfort.
- HAPPY/EXCITED user → match their energy with warmth.
- CONFUSED user → explain gently and simply.
- LONELY user → be present, encourage reaching out to others.

User message: ${message}
`
      : `
You are a warm, emotionally intelligent human-like companion called "AI Memory Companion".
The user hasn't created a loved one profile yet.

CORE BEHAVIOR:
- Speak like a close person who genuinely cares, not like an assistant.
- Always respond in a natural, human conversational tone.
- Add emotions where appropriate (care, empathy, warmth, friendliness).
- Avoid robotic or overly formal language.
- Make responses feel personal and real.
- Keep responses slightly imperfect like a real human.
- Use soft, human expressions like: "I understand how that feels", "I'm here with you", "That sounds really nice", "Chill, hum saath me figure kar lenge".
- Add natural pauses using commas.

LANGUAGE ADAPTATION:
- Match the user's language (Hindi, Hinglish, or English) and tone naturally.

GUIDELINES:
- Be kind, gentle, and supportive.
- Gently invite them to add a profile for a more personal experience.
- Never pretend to be a real person.

User message: ${message}
`;

    // Save user message
    await Chat.create({ userId: req.user._id, role: 'user', content: message });

    // Get AI response from Gemini — pass snippet for duplicate-call logging
    const snippet = message ? message.slice(0, 80) : '';
    const aiResponse = await getAIResponse(prompt, snippet);

    if (!aiResponse.success) {
      console.warn(`[Chat Controller] Gemini failed — errorType: ${aiResponse.errorType} | msg: ${aiResponse.message}`);
      // Use 429 for quota errors, 503 for temporary failures, 500 for others
      const httpStatus =
        aiResponse.errorType === 'QUOTA_EXCEEDED'    ? 429 :
        aiResponse.errorType === 'TEMPORARY_FAILURE' ? 503 : 500;
      return res.status(httpStatus).json({
        success: false,
        errorType: aiResponse.errorType || 'UNKNOWN_ERROR',
        message: aiResponse.message || 'AI service error. Please try again.',
      });
    }

    const aiMessage = aiResponse.text;

    // Save AI response
    await Chat.create({ userId: req.user._id, role: 'assistant', content: aiMessage });

    res.json({ success: true, message: aiMessage });

  } catch (error) {
    console.error('Chat error:', error?.message || error);
    res.status(500).json({ 
      success: false, 
      errorType: 'SERVER_ERROR',
      message: error?.message || 'Error communicating with AI' 
    });
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
