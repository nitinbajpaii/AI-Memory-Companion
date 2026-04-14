const axios                = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getAIResponse }    = require('../services/geminiService');
const LovedOneProfile      = require('../models/LovedOneProfile');
const Memory               = require('../models/Memory');
const Chat                 = require('../models/Chat');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transcribe audio buffer → text using Gemini 1.5 Flash multimodal.
 */
async function transcribeAudio(audioBuffer, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  // gemini-1.5-flash supports audio inlineData
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // ── Clean & Normalize mimeType ───────────────────────────────────────────
  // Gemini expects: audio/wav, audio/mp3, audio/aiff, audio/aac, audio/ogg, audio/flac, audio/webm
  let baseMimeType = (mimeType || 'audio/webm').split(';')[0].toLowerCase();
  
  // Mapping for common browser/upload variations
  const mimeMap = {
    'audio/x-m4a':  'audio/mp4',
    'audio/m4a':    'audio/mp4',
    'audio/mpeg':   'audio/mp3',
    'audio/mp3':    'audio/mp3',
    'audio/wav':    'audio/wav',
    'audio/wave':   'audio/wav',
    'audio/x-wav':  'audio/wav',
    'audio/ogg':    'audio/ogg',
    'audio/webm':   'audio/webm',
  };

  if (mimeMap[baseMimeType]) {
    baseMimeType = mimeMap[baseMimeType];
  }

  console.log(`[STT] Sending to Gemini: ${audioBuffer.length} bytes | mime: ${baseMimeType}`);

  const audioPart = {
    inlineData: {
      data: audioBuffer.toString('base64'),
      mimeType: baseMimeType,
    },
  };

  try {
    const result = await model.generateContent([
      'Transcribe the following audio message to plain text. ' +
      'Return ONLY the spoken words — no explanations, no punctuation notes, just the transcription.',
      audioPart,
    ]);

    const text = result.response.text().trim();
    
    // Check if Gemini actually transcribed something or just returned empty
    if (!text || text.length < 1) {
      console.warn('[STT] Gemini returned empty response.');
      throw new Error('NO_SPEECH_DETECTED');
    }

    return text;
  } catch (err) {
    console.error('[STT] Gemini Transcription error:', err.message);
    
    // Categorize errors for better UX
    if (err.message.includes('safety') || err.message.includes('blocked')) {
      throw new Error('SAFETY_BLOCKED');
    }
    if (err.message === 'NO_SPEECH_DETECTED') {
      throw err;
    }
    if (err.message.includes('quota') || err.message.includes('429')) {
      throw new Error('QUOTA_EXCEEDED');
    }
    
    throw new Error('TRANSCRIPTION_SERVICE_ERROR');
  }
}

/**
 * Call ElevenLabs Text-to-Speech API.
 * Returns a Buffer containing MP3 audio (or throws on failure).
 */
async function generateElevenLabsAudio(text, voiceType = 'female') {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId =
    voiceType === 'male'
      ? process.env.ELEVENLABS_VOICE_ID_MALE
      : process.env.ELEVENLABS_VOICE_ID_FEMALE;

  if (!apiKey)   throw new Error('ELEVENLABS_API_KEY not set');
  if (!voiceId)  throw new Error(`ELEVENLABS_VOICE_ID_${voiceType.toUpperCase()} not set`);

  // Trim to ElevenLabs limits (2500 chars on free tier)
  const trimmedText = text.slice(0, 2500);

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: trimmedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability:        0.55,
          similarity_boost: 0.80,
          style:            0.25,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          'xi-api-key':   apiKey,
          'Content-Type': 'application/json',
          Accept:         'audio/mpeg',
        },
        responseType: 'arraybuffer',
        timeout: 30_000,
      }
    );

    return Buffer.from(response.data);
  } catch (err) {
    if (err.response?.status === 401) throw new Error('ELEVENLABS_INVALID_KEY');
    if (err.response?.status === 429) throw new Error('ELEVENLABS_QUOTA_EXCEEDED');
    throw err;
  }
}

/**
 * Build the prompt for Gemini using user's profile + memories context.
 */
async function buildPrompt(userId, transcript) {
  const [profile, memories] = await Promise.all([
    LovedOneProfile.findOne({ userId }),
    Memory.find({ userId }),
  ]);

  const memoryContext = memories.length
    ? memories.map(m => `- ${m.memoryText} (${m.emotionTag})`).join('\n')
    : 'No memories added yet.';

  if (profile) {
    return `
You are an emotionally intelligent AI companion inspired by the memories of ${profile.name}, who was the user's ${profile.relation}.

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

TONE:
- Warm, empathetic, calm — like a close friend.
- Speak in natural Hinglish (Hindi + English mix) if appropriate.
- Encourage real-world connections; avoid unhealthy dependency.
- Keep response concise (2-4 sentences) since this is a voice reply.

EMOTIONAL GUIDANCE:
- SAD user → validate feelings gently, share a comforting memory.
- LONELY user → be present, encourage reaching out to others.
- NORMAL user → reminisce warmly, offer gentle support.

User voice message: ${transcript}
`.trim();
  }

  return `
You are a warm, emotionally intelligent grief support companion called "AI Memory Companion".
The user hasn't created a loved one profile yet.

GUIDELINES:
- Be kind, gentle, and supportive.
- Gently invite them to add a profile for a more personal experience.
- Keep response concise (2-4 sentences) since this is a voice reply.
- Speak warmly in English or Hinglish.
- Never pretend to be a real person.

User voice message: ${transcript}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

const handleVoiceChat = async (req, res) => {
  try {
    // ── 0. Validate upload ────────────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({
        success:   false,
        errorType: 'NO_AUDIO',
        message:   'No audio file received.',
      });
    }

    const voiceType = (req.body.voiceType || 'female').toLowerCase();
    const userId    = req.user._id;

    console.log(`[Voice] Received audio (${req.file.size} bytes, ${req.file.mimetype}) | voiceType: ${voiceType}`);

    // ── 1. Speech → Text (Gemini multimodal) ──────────────────────────────────
    let transcript;
    try {
      transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
      console.log('[Voice] Transcript:', transcript.slice(0, 120));
    } catch (err) {
      console.error('[Voice] Transcription failed:', err.message);

      // Map internal errors to user-friendly messages
      const errorMap = {
        'NO_SPEECH_DETECTED':           'No speech detected. Please speak clearly or try a different file.',
        'SAFETY_BLOCKED':               'Voice note blocked by safety filters. Please try again.',
        'QUOTA_EXCEEDED':               'Daily transcription limit reached.',
        'TRANSCRIPTION_SERVICE_ERROR':  'AI service error during transcription. Please try again.',
      };

      const message = errorMap[err.message] || 'Could not process audio. Please try again.';
      
      return res.status(422).json({
        success:   false,
        errorType: err.message === 'QUOTA_EXCEEDED' ? 'QUOTA_EXCEEDED' : 'TRANSCRIPTION_FAILED',
        message:   message,
      });
    }

    // ── 2. Save user voice message ─────────────────────────────────────────────
    await Chat.create({ userId, role: 'user', content: `🎤 ${transcript}` });

    // ── 3. Text → AI reply (Gemini) ────────────────────────────────────────────
    const prompt     = await buildPrompt(userId, transcript);
    const aiResponse = await getAIResponse(prompt, transcript.slice(0, 80));

    if (!aiResponse.success) {
      const httpStatus =
        aiResponse.errorType === 'QUOTA_EXCEEDED'    ? 429 :
        aiResponse.errorType === 'TEMPORARY_FAILURE' ? 503 : 500;

      return res.status(httpStatus).json({
        success:   false,
        errorType: aiResponse.errorType,
        message:   aiResponse.message,
      });
    }

    const aiText = aiResponse.text;
    await Chat.create({ userId, role: 'assistant', content: aiText });

    // ── 4. Text → Audio (ElevenLabs) ──────────────────────────────────────────
    let audioBase64 = null;
    let ttsError = null;
    try {
      const audioBuffer = await generateElevenLabsAudio(aiText, voiceType);
      audioBase64       = audioBuffer.toString('base64');
      console.log('[Voice] ElevenLabs audio generated successfully');
    } catch (err) {
      console.error('[Voice] ElevenLabs TTS failed:', err.message);
      if (err.message === 'ELEVENLABS_QUOTA_EXCEEDED') {
        ttsError = 'ElevenLabs quota exceeded. AI will reply with text only.';
      } else if (err.message === 'ELEVENLABS_INVALID_KEY') {
        ttsError = 'ElevenLabs API key is invalid. AI will reply with text only.';
      } else {
        ttsError = 'AI voice service temporarily unavailable. AI will reply with text only.';
      }
    }

    // ── 5. Respond ────────────────────────────────────────────────────────────
    return res.json({
      success:    true,
      transcript,               // what Gemini heard the user say
      text:       aiText,       // AI text reply
      audio:      audioBase64,  // base64 MP3 string (null if TTS failed)
      voiceType,
      ttsError,                 // pass non-fatal TTS error to frontend
    });

  } catch (err) {
    console.error('[Voice Controller] Unhandled error:', err.message || err);
    return res.status(500).json({
      success:   false,
      errorType: 'SERVER_ERROR',
      message:   'Voice processing failed. Please try again.',
    });
  }
};

module.exports = { handleVoiceChat };
