const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 60 },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    text:     { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
