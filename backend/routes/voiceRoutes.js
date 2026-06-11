const express = require('express');
const router  = express.Router();
const { protect }          = require('../middleware/auth');
const { handleVoiceChat, handleTtsRequest }  = require('../controllers/voiceController');

// POST /api/voice/transcribe
// Accepts JSON { text: <transcript from browser SpeechRecognition>, voiceType: 'male'|'female' }
// Browser handles transcription — backend only receives the text
router.post('/transcribe', protect, handleVoiceChat);

// POST /api/voice/tts
// Generates audio ON DEMAND for a given text
router.post('/tts', protect, handleTtsRequest);

module.exports = router;
