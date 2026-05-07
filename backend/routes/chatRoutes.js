const express = require('express');
const router = express.Router();
const { getChatResponse, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { chatRateLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, chatRateLimiter, getChatResponse);
router.get('/history/:userId', protect, getChatHistory);

module.exports = router;
