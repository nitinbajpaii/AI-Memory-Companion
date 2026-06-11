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

    const prompt = buildOptimizedPrompt(profile, memories, history.reverse(), message, 'female');
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
  const gender = (voiceGender || 'female').toLowerCase();

  try {
    console.log('[Voice] Transcript received:', message);
    console.log('Voice type:', gender);

    const [profile, memories, history] = await Promise.all([
      LovedOneProfile.findOne({ userId }).lean(),
      Memory.find({ userId }).sort({ createdAt: -1 }).limit(2).lean(),
      Chat.find({ userId }).sort({ createdAt: -1 }).limit(6).lean()
    ]);

    // Pass voiceGender so AI uses correct gender grammar
    const prompt = buildOptimizedPrompt(profile, memories, history.reverse(), message, gender);
    await Chat.create({ userId, role: 'user', content: `🎤 ${message}` });
    const aiResponse = await getAIResponse(prompt);

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    const aiMessage = aiResponse.text;
    console.log('[Voice] AI Reply:', aiMessage);

    await Chat.create({ userId, role: 'assistant', content: aiMessage });

    // ── Generate TTS audio via ElevenLabs ─────────────────────────────────
    let audioBase64 = null;
    try {
      const ttsResponse = await textToSpeech(aiMessage, gender);
      console.log('[Voice] TTS success:', ttsResponse.success);
      console.log('Audio generated:', !!ttsResponse.audio);
      console.log('Audio length:', ttsResponse.audio?.length);

      if (ttsResponse.success && ttsResponse.audio) {
        audioBase64 = ttsResponse.audio;
      }
    } catch (ttsErr) {
      // Do NOT crash — fallback to text-only if TTS fails
      console.error('[Voice] TTS generation failed (non-fatal):', ttsErr.message);
    }

    return res.json({
      success: true,
      message: aiMessage,
      audio: audioBase64,   // null if TTS failed — frontend handles gracefully
    });
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
