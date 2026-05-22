const express = require('express');
const router = express.Router();
const { handleTextChat, handleVoiceChat, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { chatRateLimiter } = require('../middleware/rateLimiter');

router.post('/text', protect, chatRateLimiter, handleTextChat);
router.post('/voice', protect, chatRateLimiter, handleVoiceChat);
router.get('/history/:userId', protect, getChatHistory);

module.exports = router;
