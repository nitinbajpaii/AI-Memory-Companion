const { ElevenLabsClient } = require("elevenlabs");

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

    if (!voiceId) {
      throw new Error('Voice ID not configured');
    }

    const audio = await client.generate({
      voice: voiceId,
      model_id: "eleven_turbo_v2_5",
      text: text,
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const base64Audio = buffer.toString('base64');

    return { success: true, audio: base64Audio };
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return { success: false, message: "TTS service unavailable" };
  }
}

module.exports = { textToSpeech };
