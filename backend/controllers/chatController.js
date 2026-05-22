const { getAIResponse } = require('../services/groqService');
const { textToSpeech } = require('../services/elevenLabsService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');
const { buildOptimizedPrompt } = require('../utils/aiHelpers');

const handleTextChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;

  try {
    const [profile, memories, history] = await Promise.all([
      LovedOneProfile.findOne({ userId }).lean(),
      Memory.find({ userId }).sort({ createdAt: -1 }).limit(2).lean(),
      Chat.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
    ]);

    const prompt = buildOptimizedPrompt(profile, memories, history.reverse(), message);
    await Chat.create({ userId, role: 'user', content: message });
    const aiResponse = await getAIResponse(prompt);

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    const aiMessage = aiResponse.text;
    await Chat.create({ userId, role: 'assistant', content: aiMessage });
    return res.json({ success: true, message: aiMessage });
  } catch (error) {
    console.error('[Text Chat Controller] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Try again.' });
  }
};

const handleVoiceChat = async (req, res) => {
  const { message, voiceGender } = req.body;
  const userId = req.user._id;

  try {
    const [profile, memories, history] = await Promise.all([
      LovedOneProfile.findOne({ userId }).lean(),
      Memory.find({ userId }).sort({ createdAt: -1 }).limit(2).lean(),
      Chat.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
    ]);

    const prompt = buildOptimizedPrompt(profile, memories, history.reverse(), message);
    await Chat.create({ userId, role: 'user', content: message });
    const aiResponse = await getAIResponse(prompt);

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    const aiMessage = aiResponse.text;
    await Chat.create({ userId, role: 'assistant', content: aiMessage });

    const ttsResponse = await textToSpeech(aiMessage, voiceGender || 'female');

    if (ttsResponse.success) {
      return res.json({ success: true, message: aiMessage, audio: ttsResponse.audio });
    } else {
      return res.json({ success: true, message: aiMessage });
    }
  } catch (error) {
    console.error('[Voice Chat Controller] Error:', error);
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

module.exports = { handleTextChat, handleVoiceChat, getChatHistory };
