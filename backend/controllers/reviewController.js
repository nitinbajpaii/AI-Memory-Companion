const Review = require('../models/Review');

/**
 * GET /api/reviews
 * Public — returns up to 20 most recent reviews
 */
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('[Reviews] getReviews error:', err.message);
    res.status(500).json({ success: false, message: 'Could not fetch reviews.' });
  }
};

/**
 * POST /api/reviews
 * Public — submit a new review
 */
const submitReview = async (req, res) => {
  try {
    const { username, rating, text } = req.body;

    if (!username || !rating || !text) {
      return res.status(400).json({ success: false, message: 'username, rating, and text are required.' });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const review = await Review.create({
      username: username.trim().slice(0, 60),
      rating:   Number(rating),
      text:     text.trim().slice(0, 500),
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error('[Reviews] submitReview error:', err.message);
    res.status(500).json({ success: false, message: 'Could not save review.' });
  }
};

module.exports = { getReviews, submitReview };
