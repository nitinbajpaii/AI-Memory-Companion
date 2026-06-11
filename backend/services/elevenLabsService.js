const axios = require('axios');

// ─── Startup Diagnostics ──────────────────────────────────────────────────────
console.log('[ElevenLabs] KEY EXISTS:', !!process.env.ELEVENLABS_API_KEY);
console.log('[ElevenLabs] KEY LENGTH:', process.env.ELEVENLABS_API_KEY?.length);
console.log('[ElevenLabs] MALE VOICE ID:', process.env.ELEVENLABS_VOICE_ID_MALE);
console.log('[ElevenLabs] FEMALE VOICE ID:', process.env.ELEVENLABS_VOICE_ID_FEMALE);

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1';

// ─── Auth Verification ────────────────────────────────────────────────────────
// Tests the API key by hitting the TTS endpoint with a tiny payload.
// Runs once on module load to surface key problems early in the logs.
async function verifyElevenLabsKey() {
  const key = process.env.ELEVENLABS_API_KEY;

  if (!key) {
    console.error('[ElevenLabs] API KEY MISSING');
    return;
  }

  try {
    const response = await axios.get(
      'https://api.elevenlabs.io/v1/user',
      {
        headers: {
          'xi-api-key': key
        }
      }
    );

    console.log('[ElevenLabs] AUTH SUCCESS');
    console.log('[ElevenLabs] USER:', response.data.subscription);

  } catch (error) {

    console.error(
      '[ElevenLabs] AUTH FAILED:',
      error.response?.status
    );

    console.error(
      '[ElevenLabs] RESPONSE:',
      JSON.stringify(error.response?.data, null, 2)
    );
  }
}

verifyElevenLabsKey();   // non-blocking startup check

// ─── Core TTS Function ────────────────────────────────────────────────────────
async function textToSpeech(text, voiceGender = 'female') {
  try {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) {
      console.error('[ElevenLabs] API key missing at call time!');
      return { success: false, message: 'ElevenLabs API key not configured.' };
    }

    const voiceId = voiceGender === 'male'
      ? process.env.ELEVENLABS_VOICE_ID_MALE
      : process.env.ELEVENLABS_VOICE_ID_FEMALE;

    console.log('[ElevenLabs] voiceGender:', voiceGender);
    console.log('[ElevenLabs] voiceId:', voiceId);
    console.log('[ElevenLabs] KEY EXISTS:', !!key);
    console.log('[ElevenLabs] KEY LENGTH:', key?.length);

    if (!voiceId) {
      console.error('[ElevenLabs] Voice ID not configured for gender:', voiceGender);
      return { success: false, message: 'Voice ID not configured for gender: ' + voiceGender };
    }

    const safeText = text.slice(0, 1000);

    // Direct axios HTTP call — no SDK, no async key resolution chain
    const response = await axios.post(
      `${ELEVENLABS_BASE}/text-to-speech/${voiceId}`,
      {
        text: safeText,
        model_id: 'eleven_flash_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': key,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
        timeout: 20000,
      }
    );

    const base64Audio = Buffer.from(response.data).toString('base64');

    console.log('[ElevenLabs] Audio generated:', !!base64Audio);
    console.log('[ElevenLabs] Audio length:', base64Audio.length);

    return { success: true, audio: base64Audio };

  } catch (error) {
    const status = error.response?.status;
    let bodyText  = '';
    try {
      const raw = error.response?.data;
      bodyText = raw instanceof Buffer ? raw.toString('utf8') : (raw ? JSON.stringify(raw) : '');
    } catch (_) { /* ignore */ }

    let detail = null;
    try { detail = JSON.parse(bodyText)?.detail; } catch (_) { /* non-JSON */ }
    const detailMsg = detail?.message || detail?.status || '';

    if (status === 401) {
      if (detailMsg.toLowerCase().includes('unusual')) {
        console.error('[ElevenLabs] 401 — FREE TIER DISABLED. Upgrade ElevenLabs plan and regenerate API key.');
      } else if (detailMsg.toLowerCase().includes('missing_permissions')) {
        console.error('[ElevenLabs] 401 — MISSING PERMISSIONS:', detailMsg);
      } else {
        console.error('[ElevenLabs] 401 — INVALID API KEY. Verify ELEVENLABS_API_KEY on Render.');
      }
      console.error('[ElevenLabs] Detail:', detailMsg || bodyText.slice(0, 200));
    }  else {
  console.error('[ElevenLabs] TTS error:', status, error.message);

  console.error(
    '[ElevenLabs] FULL ERROR:',
    JSON.stringify(error.response?.data, null, 2)
  );

  if (bodyText) {
    console.error(
      '[ElevenLabs] Body:',
      bodyText.slice(0, 300)
    );
  }
}

    return { success: false, message: 'TTS service unavailable' };
  }
}

module.exports = { textToSpeech, verifyElevenLabsKey };
