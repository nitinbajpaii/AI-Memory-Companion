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

  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  // ── 1. Build auth headers based on key format ──────────────────────────────
  const isSkKey = apiKey.startsWith('sk_');
  console.log(`[ElevenLabs] Key type detected: ${isSkKey ? 'sk_' : 'xi-'}`);

  const authHeaders = isSkKey
    ? { Authorization: `Bearer ${apiKey}` }
    : { 'xi-api-key': apiKey };

  const baseHeaders = { 'Content-Type': 'application/json', ...authHeaders };
  const ttsHeaders  = { ...baseHeaders, Accept: 'audio/mpeg' };

  const DEFAULT_VOICE    = '21m00Tcm4TlvDq8ikWAM'; // Rachel – always available
  const trimmedText      = text.slice(0, 2500);

  // ── 2. Resolve a valid voiceId ─────────────────────────────────────────────
  let resolvedVoiceId = null;

  try {
    const voicesRes = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: baseHeaders,
      timeout: 10000,
    });

    const availableVoices = voicesRes.data?.voices ?? [];
    console.log(`[ElevenLabs] Fetched ${availableVoices.length} voice(s) from account.`);

    const ids = availableVoices.map((v) => v.voice_id);

    if (configuredVoiceId && ids.includes(configuredVoiceId)) {
      resolvedVoiceId = configuredVoiceId;
      console.log(`[ElevenLabs] Configured voiceId "${resolvedVoiceId}" is valid.`);
    } else if (configuredVoiceId) {
      console.warn(
        `[ElevenLabs] Configured voiceId "${configuredVoiceId}" not found in account. ` +
        `Falling back to first available voice.`
      );
      resolvedVoiceId = ids[0] ?? DEFAULT_VOICE;
      console.log(`[ElevenLabs] Fallback voiceId selected: "${resolvedVoiceId}"`);
    } else {
      resolvedVoiceId = ids[0] ?? DEFAULT_VOICE;
      console.log(`[ElevenLabs] No voiceId configured. Using: "${resolvedVoiceId}"`);
    }
  } catch (fetchErr) {
    const status = fetchErr.response?.status;
    console.error(
      `[ElevenLabs] Could not fetch voices list (status: ${status ?? 'Network Error'}). ` +
      `Proceeding with configured or default voiceId.`
    );

    if (status === 401) {
      // Auth is definitely broken – no point attempting TTS
      console.error('[ElevenLabs] 401 on /voices – API key is invalid or expired.');
      throw new Error('ELEVENLABS_INVALID_KEY');
    }

    // Network hiccup – proceed with what we have
    resolvedVoiceId = configuredVoiceId ?? DEFAULT_VOICE;
  }

  // ── 3. Attempt TTS with resolved voice, then hard fallback ─────────────────
  const voicesToTry = [...new Set([resolvedVoiceId, DEFAULT_VOICE])].filter(Boolean);
  let lastError = null;

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
        { headers: ttsHeaders, responseType: 'arraybuffer', timeout: 30000 }
      );

      console.log(`[ElevenLabs] TTS success! Status: ${response.status}, voiceId: "${currentVoiceId}"`);
      return Buffer.from(response.data);
    } catch (err) {
      lastError = err;
      const status = err.response?.status;

      console.error(
        `[ElevenLabs] TTS failed for voiceId "${currentVoiceId}". Status: ${status ?? 'Network Error'}`
      );

      if (status === 401) {
        // We already verified the key works on /voices – this 401 is voice-level permission
        console.warn(
          `[ElevenLabs] 401 on TTS for voiceId "${currentVoiceId}" – voice may be restricted. ` +
          (currentVoiceId !== DEFAULT_VOICE ? 'Trying default fallback voice...' : 'All options exhausted.')
        );
      }

      if (status === 429) {
        // Quota hit – no point retrying other voices
        throw new Error('ELEVENLABS_QUOTA_EXCEEDED');
      }

      if (currentVoiceId !== DEFAULT_VOICE) {
        console.log(`[ElevenLabs] Falling back to default voice "${DEFAULT_VOICE}"...`);
        continue;
      }

      break; // DEFAULT_VOICE also failed – give up
    }
  }

  // ── 4. Surface a meaningful error ──────────────────────────────────────────
  const finalStatus = lastError?.response?.status;

  if (finalStatus === 401) throw new Error('ELEVENLABS_INVALID_KEY');
  if (finalStatus === 429) throw new Error('ELEVENLABS_QUOTA_EXCEEDED');
  throw new Error('ELEVENLABS_SERVICE_ERROR');
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

      audioBase64 = audioBuffer.toString('base64');
    } catch (err) {
      if (err.message.includes('QUOTA')) {
        ttsError =
          'ElevenLabs quota exceeded. AI will reply with text only.';
      } else if (err.message.includes('INVALID_KEY')) {
        ttsError =
          'ElevenLabs API key is invalid. AI will reply with text only.';
      } else {
        ttsError =
          'AI voice service temporarily unavailable.';
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