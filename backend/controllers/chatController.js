const { getAIResponse } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');
const { buildOptimizedPrompt } = require('../utils/aiHelpers');

/**
 * Optimized Chat Handler (Gemini Flash + Context Trimming)
 */
const getChatResponse = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    // ── 1. Optimized Data Retrieval (Parallel) ──────────────────────────────
    const [profile, memories, history] = await Promise.all([
      LovedOneProfile.findOne({ userId }).lean(),
      Memory.find({ userId }).sort({ createdAt: -1 }).limit(2).lean(), // Top 2 memories
      Chat.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()   // Last 6 messages
    ]);

    // ── 2. Build Optimized Prompt ───────────────────────────────────────────
    const prompt = buildOptimizedPrompt(profile, memories, history.reverse(), message);

    // ── 3. Optimistic Save (Save User Message First) ───────────────────────
    await Chat.create({ userId, role: 'user', content: message });

    // ── 4. AI Request ───────────────────────────────────────────────────────
    const aiResponse = await getAIResponse(prompt, message.slice(0, 50));

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    // ── 5. Save & Respond ───────────────────────────────────────────────────
    const aiMessage = aiResponse.text;
    await Chat.create({ userId, role: 'assistant', content: aiMessage });

    return res.json({ success: true, message: aiMessage });

  } catch (error) {
    console.error('[Chat Controller] Fatal Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error. Try again.' });
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
