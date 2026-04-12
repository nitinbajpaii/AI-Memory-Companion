const express = require('express');
const router = express.Router();
const { addMemory, getMemories, deleteMemory } = require('../controllers/memoryController');
const { protect } = require('../middleware/auth');

router.post('/add', protect, addMemory);
router.get('/:userId', protect, getMemories);
router.delete('/:id', protect, deleteMemory);

module.exports = router;
