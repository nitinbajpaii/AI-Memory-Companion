const { ElevenLabsClient } = require('elevenlabs');

let elevenLabsClient = null;

const getElevenLabsClient = () => {
  if (elevenLabsClient) return elevenLabsClient;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is missing');
  elevenLabsClient = new ElevenLabsClient({ apiKey });
  return elevenLabsClient;
};

async function textToSpeech(text, voiceGender = 'female') {
  try {
    const client = getElevenLabsClient();
    const voiceId = voiceGender === 'male'
      ? process.env.ELEVENLABS_VOICE_ID_MALE
      : process.env.ELEVENLABS_VOICE_ID_FEMALE;

    console.log('[ElevenLabs] voiceGender:', voiceGender, '| voiceId:', voiceId);

    if (!voiceId) {
      throw new Error('Voice ID not configured for gender: ' + voiceGender);
    }

    // Limit text to avoid going over ElevenLabs character limits
    const safeText = text.slice(0, 1000);

    const audio = await client.generate({
      voice: voiceId,
      // eleven_flash_v2_5 is valid for multilingual flash tier
      model_id: 'eleven_flash_v2_5',
      text: safeText,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64Audio = buffer.toString('base64');

    console.log('[ElevenLabs] Audio generated successfully. Base64 length:', base64Audio.length);

    return { success: true, audio: base64Audio };
  } catch (error) {
    console.error('[ElevenLabs] TTS error:', error?.message || error);
    return { success: false, message: 'TTS service unavailable' };
  }
}

module.exports = { textToSpeech };
