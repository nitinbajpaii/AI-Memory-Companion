const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAIResponse } = require('../services/geminiService');
const LovedOneProfile = require('../models/LovedOneProfile');
const Memory = require('../models/Memory');
const Chat = require('../models/Chat');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function transcribeAudio(audioBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
  });

  let normalizedMimeType = mimeType || 'audio/webm';

  if (normalizedMimeType === 'audio/mp3')
    normalizedMimeType = 'audio/mpeg';

  if (normalizedMimeType === 'audio/x-wav')
    normalizedMimeType = 'audio/wav';

  if (normalizedMimeType === 'audio/m4a')
    normalizedMimeType = 'audio/mp4';

  if (normalizedMimeType === 'audio/3gpp')
    normalizedMimeType = 'audio/mp4';

  if (normalizedMimeType.includes('webm'))
    normalizedMimeType = 'audio/webm';

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('EMPTY_AUDIO_BUFFER');
  }

  console.log('[STT] buffer length:', audioBuffer.length);

  const audioBase64 = audioBuffer.toString('base64');

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: normalizedMimeType,
          data: audioBase64,
        },
      },
      {
        text: 'Transcribe this audio exactly and return only the spoken text.',
      },
    ]);

    const transcription = result.response.text()?.trim();

    console.log('[STT] Gemini response:', transcription);

    if (!transcription) {
      throw new Error('NO_SPEECH_DETECTED');
    }

    return transcription;
  } catch (err) {
    console.error(
      '[STT] Gemini transcription error:',
      err.response?.data || err.message
    );

    const msg = err.message || '';

    if (msg.includes('safety') || msg.includes('blocked')) {
      throw new Error('SAFETY_BLOCKED');
    }

    if (msg === 'NO_SPEECH_DETECTED') {
      throw err;
    }

    if (msg.includes('quota') || msg.includes('429')) {
      throw new Error('QUOTA_EXCEEDED');
    }

    if (
      msg.includes('404') ||
      msg.includes('model') ||
      msg.includes('not found')
    ) {
      throw new Error('MODEL_NOT_FOUND');
    }

    throw new Error('TRANSCRIPTION_SERVICE_ERROR');
  }
}

async function generateElevenLabsAudio(text, voiceType = 'female') {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const configuredVoiceId =
    voiceType === 'male'
      ? process.env.ELEVENLABS_VOICE_ID_MALE
      : process.env.ELEVENLABS_VOICE_ID_FEMALE;

  // ── Debug: log key presence (never log the full key) ─────────────────────
  console.log(`[ElevenLabs] API key present: ${apiKey ? 'YES (length ' + apiKey.length + ')' : 'NO'}`);
  console.log(`[ElevenLabs] voiceType: ${voiceType} | configuredVoiceId: ${configuredVoiceId || '(not set)'}`);

  if (!apiKey) {
    console.error('[ElevenLabs] ELEVENLABS_API_KEY is not set in environment variables.');
    throw new Error('INVALID_API_KEY');
  }

  const DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM';
  const trimmedText = text.slice(0, 2500);

  const authHeaders = {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg',
  };

  // ── Step 1: Pre-flight — validate API key & resolve voiceId ──────────────
  let resolvedVoiceId = configuredVoiceId || DEFAULT_VOICE;

  try {
    const voicesRes = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey },
      timeout: 10000,
    });

    const voices = voicesRes.data?.voices || [];
    console.log(`[ElevenLabs] Voices fetched: ${voices.length}`);

    const voiceIds = voices.map((v) => v.voice_id);

    if (configuredVoiceId && voiceIds.includes(configuredVoiceId)) {
      resolvedVoiceId = configuredVoiceId;
      console.log(`[ElevenLabs] voiceId "${configuredVoiceId}" confirmed in account.`);
    } else if (configuredVoiceId) {
      console.warn(`[ElevenLabs] voiceId "${configuredVoiceId}" NOT found in account. Falling back to default "${DEFAULT_VOICE}".`);
      resolvedVoiceId = DEFAULT_VOICE;
    } else {
      console.log(`[ElevenLabs] No configuredVoiceId set. Using default "${DEFAULT_VOICE}".`);
      resolvedVoiceId = DEFAULT_VOICE;
    }
  } catch (prefErr) {
    const prefStatus = prefErr.response?.status;

    if (prefStatus === 401) {
      console.error('[ElevenLabs] Pre-flight 401 — API key is invalid or expired.');
      throw new Error('INVALID_API_KEY');
    }

    if (prefStatus === 429) {
      console.error('[ElevenLabs] Pre-flight 429 — quota exceeded.');
      throw new Error('QUOTA_EXCEEDED');
    }

    // Network / timeout — proceed with configured or default voice
    console.warn(`[ElevenLabs] Pre-flight voices fetch failed (${prefStatus ?? 'Network Error'}): ${prefErr.message}. Proceeding with voiceId "${resolvedVoiceId}".`);
  }

  // ── Step 2: TTS request with fallback chain ───────────────────────────────
  const voicesToTry = [...new Set([resolvedVoiceId, DEFAULT_VOICE])].filter(Boolean);
  console.log(`[ElevenLabs] Selected voiceId: "${resolvedVoiceId}" | chain: ${voicesToTry.join(' → ')}`);

  for (const currentVoiceId of voicesToTry) {
    try {
      console.log(`[ElevenLabs] Attempting TTS with voiceId: "${currentVoiceId}"`);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}`,
        {
          text: trimmedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        },
        { headers: authHeaders, responseType: 'arraybuffer', timeout: 30000 }
      );

      console.log(`[ElevenLabs] TTS SUCCESS — status: ${response.status}, voiceId: "${currentVoiceId}", bytes: ${response.data.byteLength}`);
      return Buffer.from(response.data);
    } catch (err) {
      const status = err.response?.status;
      const errBody = err.response?.data ? Buffer.from(err.response.data).toString().slice(0, 200) : err.message;

      console.error(`[ElevenLabs] TTS failed for voiceId "${currentVoiceId}" — status: ${status ?? 'Network Error'} | reason: ${errBody}`);

      if (status === 401) {
        console.error('[ElevenLabs] 401 during TTS — INVALID_API_KEY');
        throw new Error('INVALID_API_KEY');
      }

      if (status === 429) {
        console.error('[ElevenLabs] 429 during TTS — QUOTA_EXCEEDED');
        throw new Error('QUOTA_EXCEEDED');
      }

      if (!err.response) {
        // Pure network error
        if (currentVoiceId === voicesToTry[voicesToTry.length - 1]) {
          console.error('[ElevenLabs] Network error on final voice option — SERVICE_UNAVAILABLE');
          throw new Error('SERVICE_UNAVAILABLE');
        }
        console.log('[ElevenLabs] Network error — trying next voice...');
        continue;
      }

      if (currentVoiceId === DEFAULT_VOICE) {
        console.error('[ElevenLabs] Default voice also failed — SERVICE_UNAVAILABLE');
        throw new Error('SERVICE_UNAVAILABLE');
      }

      console.log(`[ElevenLabs] Falling back to default voice "${DEFAULT_VOICE}"...`);
    }
  }

  // Guard — should never reach here
  throw new Error('SERVICE_UNAVAILABLE');
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const handleVoiceChat = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        errorType: 'NO_AUDIO',
        message: 'No audio file received.',
      });
    }

    const voiceType = (req.body.voiceType || 'female').toLowerCase();
    const userId = req.user._id;

    let transcript;

    try {
      transcript = await transcribeAudio(
        req.file.buffer,
        req.file.mimetype
      );
    } catch (err) {
      const errorMap = {
        EMPTY_AUDIO_BUFFER:
          'The audio file appears to be empty.',

        NO_SPEECH_DETECTED:
          'No speech detected. Please speak clearly.',

        SAFETY_BLOCKED:
          'Voice content blocked by safety filters.',

        QUOTA_EXCEEDED:
          'Daily transcription limit reached.',

        MODEL_NOT_FOUND:
          'Gemini model configuration issue.',

        TRANSCRIPTION_SERVICE_ERROR:
          'AI transcription service temporarily unavailable.',
      };

      const message =
        errorMap[err.message] ||
        'Could not process audio. Please try again.';

      return res.status(422).json({
        success: false,
        errorType: err.message,
        message,
      });
    }

    await Chat.create({
      userId,
      role: 'user',
      content: `🎤 ${transcript}`,
    });

    const prompt = await buildPrompt(userId, transcript);

    const aiResponse = await getAIResponse(
      prompt,
      transcript.slice(0, 80)
    );

    if (!aiResponse.success) {
      return res.status(500).json({
        success: false,
        message: aiResponse.message,
      });
    }

    const aiText =
      aiResponse.text ||
      'Main yahin hoon, tum akela feel mat karo 💜';

    await Chat.create({
      userId,
      role: 'assistant',
      content: aiText,
    });

    let audioBase64 = null;
    let ttsError = null;

    try {
      const audioBuffer = await generateElevenLabsAudio(
        aiText,
        voiceType
      );

      if (audioBuffer) audioBase64 = audioBuffer.toString('base64');
    } catch (err) {
      console.error(`[ElevenLabs] TTS error caught in handler — code: ${err.message}`);

      if (err.message === 'INVALID_API_KEY') {
        ttsError = 'ElevenLabs API key is invalid. AI will reply with text only.';
      } else if (err.message === 'QUOTA_EXCEEDED') {
        ttsError = 'ElevenLabs quota exceeded. AI will reply with text only.';
      } else if (err.message === 'SERVICE_UNAVAILABLE') {
        ttsError = 'AI voice service temporarily unavailable.';
      } else {
        ttsError = 'AI voice service encountered an unexpected error.';
      }
    }

    return res.json({
      success: true,
      transcript,
      text: aiText,
      audio: audioBase64,
      voiceType,
      ttsError,
    });
  } catch (err) {
    console.error('[Voice Controller Error]:', err);

    return res.status(500).json({
      success: false,
      errorType: 'SERVER_ERROR',
      message: 'Voice processing failed.',
    });
  }
};

module.exports = { handleVoiceChat };