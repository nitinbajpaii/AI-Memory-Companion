const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const { protect }          = require('../middleware/auth');
const { handleVoiceChat, handleTtsRequest }  = require('../controllers/voiceController');

// Use memory storage — no temp files needed, works on Render's ephemeral filesystem
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  },
});

// POST /api/voice/transcribe
// Accepts multipart audio, runs full STT → AI → pipeline (TEXT ONLY)
router.post('/transcribe', protect, upload.single('audio'), handleVoiceChat);

// POST /api/voice/tts
// Generates audio ON DEMAND for a given text
router.post('/tts', protect, handleTtsRequest);

module.exports = router;
