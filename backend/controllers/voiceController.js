const axios = require('axios');
const { getAIResponse, getGeminiClient } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Delay helper (shared with retry loop below)
const _delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function transcribeAudio(audioBuffer, mimeType) {
  // ── Re-use the singleton @google/genai client ────────────────────────────────
  const ai = getGeminiClient();

  // ── MIME normalisation ───────────────────────────────────────────────────
  let normalizedMimeType = mimeType || 'audio/webm';
  if (normalizedMimeType === 'audio/mp3')   normalizedMimeType = 'audio/mpeg';
  if (normalizedMimeType === 'audio/x-wav') normalizedMimeType = 'audio/wav';
  if (normalizedMimeType === 'audio/m4a')   normalizedMimeType = 'audio/mp4';
  if (normalizedMimeType === 'audio/3gpp')  normalizedMimeType = 'audio/mp4';
  if (normalizedMimeType.includes('webm'))  normalizedMimeType = 'audio/webm';

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('EMPTY_AUDIO_BUFFER');
  }

  console.log('[STT] buffer length:', audioBuffer.length);
  console.log('[STT] mimeType resolved to:', normalizedMimeType);

  const audioBase64 = audioBuffer.toString('base64');

  // ── Retry config (mirrors getAIResponse) ────────────────────────────────
  const MAX_RETRIES = 3;
  const BASE_DELAY  = 1000;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // ── New SDK: ai.models.generateContent with multimodal contents format ──
      // FIX: gemini-1.5-flash is unavailable on v1beta (@google/genai v1.x).
      // gemini-2.0-flash supports multimodal audio input and is available on this SDK version.
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: normalizedMimeType,
                  data: audioBase64,
                },
              },
              {
                text: 'Transcribe this audio exactly and return only the spoken text.',
              },
            ],
          },
        ],
      });

      const transcription = result.text?.trim();
      console.log('[STT] Gemini response (attempt', attempt + 1, '):', transcription);

      if (!transcription) throw new Error('NO_SPEECH_DETECTED');

      return transcription;

    } catch (err) {
      const msg    = (err.message || '').toLowerCase();
      const status = err.status || err.httpErrorCode ||
                     (err.response ? err.response.status : null);

      // ── Pass-through errors — do not retry ───────────────────────────
      if (err.message === 'NO_SPEECH_DETECTED')  throw err;
      if (msg.includes('safety') || msg.includes('blocked')) {
        throw new Error('SAFETY_BLOCKED');
      }

      console.error('[STT] Gemini error (attempt', attempt + 1, '):', err.response?.data || err.message);

      // ── Retryable: 429 quota or 503 overloaded ───────────────────────
      const isQuota =
        status === 429 ||
        msg.includes('quota') || msg.includes('rate limit') ||
        msg.includes('rate_limit') || msg.includes('resource_exhausted') ||
        msg.includes('exhausted') || msg.includes('too many requests') ||
        msg.includes('requests per minute') || msg.includes('requests per day') ||
        msg.includes('daily limit') || msg.includes('rpm') || msg.includes('rpd') ||
        (msg.includes('token') && msg.includes('limit'));

      const isOverloaded =
        status === 503 ||
        msg.includes('overloaded') || msg.includes('service unavailable') ||
        msg.includes('unavailable');

      if ((isQuota || isOverloaded) && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1);
        console.warn(`[STT] ${isQuota ? '429 Quota' : '503 Overloaded'} — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
        await _delay(wait);
        continue;
      }

      if (isQuota || isOverloaded) throw new Error('QUOTA_EXCEEDED');

      // ── Network / server errors — retry ─────────────────────────────
      const isNetwork =
        (status >= 500 && status !== 503) ||
        msg.includes('timeout') || msg.includes('network') ||
        msg.includes('econnreset') || msg.includes('socket') ||
        msg.includes('fetch failed');

      if (isNetwork && attempt < MAX_RETRIES) {
        const wait = BASE_DELAY * (attempt + 1);
        console.warn(`[STT] Network error — retry ${attempt + 1}/${MAX_RETRIES} in ${wait}ms`);
        await _delay(wait);
        continue;
      }

      // ── 404 / model not found ────────────────────────────────────────
      if (
        msg.includes('404') || msg.includes('not found') ||
        (msg.includes('model') && (msg.includes('invalid') || msg.includes('not found')))
      ) {
        throw new Error('MODEL_NOT_FOUND');
      }

      // ── Catch-all ────────────────────────────────────────────────────
      throw new Error('TRANSCRIPTION_SERVICE_ERROR');
    }
  }

  // Safety net — should never reach here
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