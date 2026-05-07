const { getAIResponse } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');

const getChatResponse = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // ── Optimized Context Retrieval ──────────────────────────────────────────
    // Fetch profile and memories in parallel
    // OPTIMIZATION: Only top 2 memories (simulated semantic retrieval by sorting)
    const [profile, memories, history] = await Promise.all([
      LovedOneProfile.findOne({ userId }),
      Memory.find({ userId }).sort({ createdAt: -1 }).limit(2),
      Chat.find({ userId }).sort({ createdAt: -1 }).limit(6) // Only last 6 messages
    ]);

    // Reverse history to keep chronological order for Gemini
    const recentHistory = history.reverse();

    const memoryContext = memories.length
      ? memories.map(m => `- ${m.memoryText} (${m.emotionTag})`).join('\n')
      : 'No specific memories yet.';

    const historyContext = recentHistory.length
      ? recentHistory.map(c => `${c.role === 'user' ? 'User' : 'Assistant'}: ${c.content}`).join('\n')
      : '';

    // ── Optimized Prompt ─────────────────────────────────────────────────────
    const prompt = profile
      ? `You are an emotionally intelligent AI companion inspired by ${profile.name} (${profile.relation}).
PERSONA: ${profile.personality}. Habits: ${profile.habits}.
MEMORIES:
${memoryContext}
CONTEXT:
${historyContext}
User: ${message}
RULES: Reply in warm Hinglish. Concise (<60 words). Validate emotions.`
      : `You are a warm grief support AI. Concise (<60 words). Hinglish. User: ${message}`;

    // Save user message
    await Chat.create({ userId, role: 'user', content: message });

    // Get AI response
    const snippet = message ? message.slice(0, 50) : '';
    const aiResponse = await getAIResponse(prompt, snippet);

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    const aiMessage = aiResponse.text;

    // Save AI response
    await Chat.create({ userId, role: 'assistant', content: aiMessage });

    res.json({ success: true, message: aiMessage });

  } catch (error) {
    console.error('[Chat Controller Error]:', error?.message);
    res.status(500).json({ success: false, message: 'Server error, try again.' });
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
