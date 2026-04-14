const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const { protect }          = require('../middleware/auth');
const { handleVoiceChat }  = require('../controllers/voiceController');

// Use memory storage — no temp files needed, works on Render's ephemeral filesystem
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    // Allow audio types, video/webm (sometimes used for webm audio), and application/octet-stream for unrecognised extensions
    if (
      file.mimetype.startsWith('audio/') || 
      file.mimetype === 'video/webm' ||
      file.originalname.match(/\.(mp3|wav|m4a|webm|ogg)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  },
});

// POST /api/voice/transcribe
// Accepts multipart audio, runs full STT → AI → TTS pipeline
router.post('/transcribe', protect, upload.single('audio'), handleVoiceChat);

module.exports = router;
