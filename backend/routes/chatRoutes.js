const express = require('express');
const router = express.Router();
const { getChatResponse, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, getChatResponse);
router.get('/history/:userId', protect, getChatHistory);

module.exports = router;
