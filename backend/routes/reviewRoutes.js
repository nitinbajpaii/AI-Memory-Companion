const express = require('express');
const router  = express.Router();
const { getReviews, submitReview } = require('../controllers/reviewController');

router.get('/',  getReviews);
router.post('/', submitReview);

module.exports = router;
