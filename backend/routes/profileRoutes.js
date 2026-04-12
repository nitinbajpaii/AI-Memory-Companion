const express = require('express');
const router = express.Router();
const { createProfile, getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createProfile);
router.get('/:userId', protect, getProfile);
router.put('/update/:id', protect, updateProfile);

module.exports = router;
