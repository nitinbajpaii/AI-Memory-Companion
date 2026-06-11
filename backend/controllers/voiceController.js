const { getAIResponse } = require('../services/groqService');
const { textToSpeech }  = require('../services/elevenLabsService');
const LovedOneProfile   = require('../models/LovedOneProfile');
const Memory            = require('../models/Memory');
const Chat              = require('../models/Chat');

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT BUILDER  (voice-specific, with gender-aware grammar)
// ─────────────────────────────────────────────────────────────────────────────

async function buildVoicePrompt(userId, transcript, voiceGender = 'female') {
  const [profile, memories] = await Promise.all([
    LovedOneProfile.findOne({ userId }),
    Memory.find({ userId }),
  ]);

  const memoryContext = memories.length
    ? memories.map((m) => `- ${m.memoryText} (${m.emotionTag})`).join('\n')
    : 'No memories added yet.';

  const genderNote = voiceGender === 'male'
    ? 'Use masculine Hindi grammar: "Main sun raha hoon", "Main samajh raha hoon", "Main tumhare saath hoon".'
    : 'Use feminine Hindi grammar: "Main sun rahi hoon", "Main samajh rahi hoon", "Main tumhare saath hoon".';

  if (profile) {
    return `
You are an emotionally intelligent AI companion inspired by the memories of ${profile.name}, who was the user's ${profile.relation}.

CRITICAL RULES:
- You are NOT ${profile.name}
- Comfort and healing only
- Speak warm Hinglish
- Keep reply concise (2-4 lines)
- ${genderNote}

MEMORIES:
${memoryContext}

User voice message: ${transcript}
`.trim();
  }

  return `
You are a warm grief support AI companion.

Be kind, gentle and supportive.
Keep reply concise (2-4 lines).
${genderNote}

User voice message: ${transcript}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN VOICE HANDLER
// Receives: { text: <transcript from browser SpeechRecognition>, voiceType: 'male'|'female' }
// Returns:  { success, message, audio }
// ─────────────────────────────────────────────────────────────────────────────

const handleVoiceChat = async (req, res) => {
  try {
    const { text: transcript, voiceType } = req.body;
    const voiceGender = (voiceType || 'female').toLowerCase();
    const userId = req.user._id;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ success: false, message: 'No transcript received.' });
    }

    console.log('[Voice] Transcript:', transcript);
    console.log('[Voice] Voice type:', voiceGender);

    // ── 1. Save user message ─────────────────────────────────────────────────
    await Chat.create({ userId, role: 'user', content: `🎤 ${transcript}` });

    // ── 2. Groq AI reply ─────────────────────────────────────────────────────
    const prompt = await buildVoicePrompt(userId, transcript, voiceGender);
    const aiResponse = await getAIResponse(prompt);

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message,
      });
    }

    const aiText = aiResponse.text;
    console.log('[Voice] AI Reply:', aiText);

    await Chat.create({ userId, role: 'assistant', content: aiText });

    // ── 3. ElevenLabs TTS ────────────────────────────────────────────────────
    let audioBase64 = null;
    try {
      const ttsResult = await textToSpeech(aiText, voiceGender);
      console.log('[Voice] Audio generated:', !!ttsResult.audio);
      console.log('[Voice] Audio length:', ttsResult.audio?.length);
      if (ttsResult.success && ttsResult.audio) {
        audioBase64 = ttsResult.audio;
      }
    } catch (ttsErr) {
      // Non-fatal — return text reply even if TTS fails
      console.error('[Voice] ElevenLabs TTS failed (non-fatal):', ttsErr.message);
    }

    return res.json({
      success: true,
      message: aiText,
      audio: audioBase64,   // null if TTS failed — frontend shows text fallback
    });

  } catch (err) {
    console.error('[Voice Controller] Error:', err);
    return res.status(500).json({ success: false, message: 'Voice processing failed.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ON-DEMAND TTS HANDLER  (used by VoiceBubble play button)
// ─────────────────────────────────────────────────────────────────────────────

const handleTtsRequest = async (req, res) => {
  try {
    const { text, voiceType } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'No text provided.' });

    const ttsResult = await textToSpeech(text, voiceType || 'female');
    if (ttsResult.success && ttsResult.audio) {
      return res.json({ success: true, audio: ttsResult.audio });
    }
    return res.status(503).json({ success: false, message: 'TTS service unavailable.' });
  } catch (err) {
    console.error('[TTS Handler] Error:', err);
    return res.status(503).json({ success: false, message: 'Voice service unavailable.' });
  }
};

module.exports = { handleVoiceChat, handleTtsRequest };