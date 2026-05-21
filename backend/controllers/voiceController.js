const axios = require('axios');
const { getAIResponse, getOpenAIClient } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Delay helper (shared with retry loop below)
const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function transcribeAudio(audioBuffer, mimeType) {
  const ai = getOpenAIClient();

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('EMPTY_AUDIO_BUFFER');
  }

  // Determine file extension
  let ext = '.webm';
  if (mimeType === 'audio/mp3' || mimeType === 'audio/mpeg') ext = '.mp3';
  if (mimeType === 'audio/wav' || mimeType === 'audio/x-wav') ext = '.wav';
  if (mimeType === 'audio/mp4' || mimeType === 'audio/m4a' || mimeType === 'audio/3gpp') ext = '.mp4';
  
  // Create a temporary file
  const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`);
  fs.writeFileSync(tempFilePath, audioBuffer);

  const MAX_RETRIES = 2;
  const BASE_DELAY  = 2000;

  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await ai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: 'whisper-1',
        });

        const transcription = response.text?.trim();
        
        console.log('[STT] Success on attempt', attempt + 1);

        if (!transcription) throw new Error('NO_SPEECH_DETECTED');

        return transcription;

      } catch (err) {
        const msg    = (err.message || '').toLowerCase();
        const status = err.status || (err.response ? err.response.status : null);

        // ── Pass-through errors — do not retry ───────────────────────────
        if (err.message === 'NO_SPEECH_DETECTED')  throw err;

        console.error('[STT] OpenAI error (attempt', attempt + 1, '):', err.response?.data || err.message);

        // ── Retryable: 429 quota or 503 overloaded ───────────────────────
        const isQuota = status === 429 || msg.includes('quota') || msg.includes('rate limit');
        const isOverloaded = status >= 500 || msg.includes('overloaded') || msg.includes('timeout') || msg.includes('network');

        if ((isQuota || isOverloaded) && attempt < MAX_RETRIES) {
          const wait = BASE_DELAY * (attempt + 1);
          console.warn(`[STT] Temp error — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
          await _delay(wait);
          continue;
        }

        if (isQuota) throw new Error('QUOTA_EXCEEDED');

        // ── Catch-all ────────────────────────────────────────────────────
        throw new Error('TRANSCRIPTION_SERVICE_ERROR');
      }
    }
  } finally {
    // Cleanup temporary file
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (e) {
      console.error('[STT] Failed to delete temp file:', e);
    }
  }

  // Safety net
  throw new Error('TRANSCRIPTION_SERVICE_ERROR');
}

/**
 * Call ElevenLabs Text-to-Speech API (Optimized).
 */
async function generateElevenLabsAudio(text, voiceType = 'female') {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  let voiceId = voiceType === 'male'
      ? process.env.ELEVENLABS_VOICE_ID_MALE
      : process.env.ELEVENLABS_VOICE_ID_FEMALE;

  if (!apiKey) throw new Error('INVALID_API_KEY');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg',
  };

  if (apiKey.startsWith('sk_')) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else {
    headers['xi-api-key'] = apiKey;
  }

  const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM'; // Rachel
  const voicesToTry = [voiceId, DEFAULT_VOICE].filter(Boolean);

  for (const currentVoiceId of voicesToTry) {
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}`,
        {
          text: text.slice(0, 1000), // Concise text for faster TTS
          model_id: 'eleven_flash_v2', // Faster and cheaper
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        },
        { headers, responseType: 'arraybuffer', timeout: 15000 }
      );

      return Buffer.from(response.data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) throw new Error('INVALID_API_KEY');
      if (status === 429) throw new Error('QUOTA_EXCEEDED');
      if (currentVoiceId !== DEFAULT_VOICE) continue;
      throw new Error('SERVICE_UNAVAILABLE');
    }
  }
}




async function buildPrompt(userId, transcript) {
  const [profile, memories] = await Promise.all([
    LovedOneProfile.findOne({ userId }),
    Memory.find({ userId }),
  ]);

  const memoryContext = memories.length
    ? memories
        .map((m) => `- ${m.memoryText} (${m.emotionTag})`)
        .join('\n')
    : 'No memories added yet.';

  if (profile) {
    return `
You are an emotionally intelligent AI companion inspired by the memories of ${profile.name}, who was the user's ${profile.relation}.

CRITICAL RULES:
- You are NOT ${profile.name}
- Comfort and healing only
- Speak warm Hinglish
- Keep reply concise (2-4 lines)

MEMORIES:
${memoryContext}

User voice message: ${transcript}
`.trim();
  }

  return `
You are a warm grief support AI companion.

Be kind, gentle and supportive.
Keep reply concise (2-4 lines)

User voice message: ${transcript}
`.trim();
}

/**
 * MAIN HANDLER (Optimized for TEXT-FIRST + VOICE-ON-DEMAND)
 */
const handleVoiceChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio received.' });
    }

    const userId = req.user._id;

    // ── 1. Speech → Text ────────────────────────────────────────────────────
    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
    
    // Save user voice message
    await Chat.create({ userId, role: 'user', content: `🎤 ${transcript}` });

    // ── 2. Text → AI reply ──────────────────────────────────────────────────
    // Reusing chat context logic from buildPrompt
    const prompt = await buildPrompt(userId, transcript);
    const aiResponse = await getAIResponse(prompt, transcript.slice(0, 50));

    if (!aiResponse.success) {
      return res.status(aiResponse.errorType === 'QUOTA_EXCEEDED' ? 429 : 503).json({
        success: false,
        errorType: aiResponse.errorType,
        message: aiResponse.message
      });
    }

    const aiText = aiResponse.text;
    await Chat.create({ userId, role: 'assistant', content: aiText });

    // ── 3. Respond (TEXT ONLY) ──────────────────────────────────────────────
    // Audio is now generated ON DEMAND via a separate endpoint
    return res.json({
      success: true,
      transcript,
      text: aiText,
      voiceType: (req.body.voiceType || 'female').toLowerCase()
    });

  } catch (err) {
    console.error('[Voice Controller Error]:', err);
    return res.status(500).json({ success: false, message: 'Voice processing failed.' });
  }
};

/**
 * VOICE-ON-DEMAND HANDLER
 * Generates audio only when user clicks play.
 */
const handleTtsRequest = async (req, res) => {
  try {
    const { text, voiceType } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'No text provided.' });

    const audioBuffer = await generateElevenLabsAudio(text, voiceType);
    const audioBase64 = audioBuffer.toString('base64');

    return res.json({ success: true, audio: audioBase64 });
  } catch (err) {
    console.error('[TTS Error]:', err);
    const status = err.message === 'QUOTA_EXCEEDED' ? 429 : 503;
    return res.status(status).json({ success: false, message: 'Voice service unavailable.' });
  }
};

module.exports = { handleVoiceChat, handleTtsRequest };