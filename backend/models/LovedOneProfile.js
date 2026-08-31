const mongoose = require('mongoose');

const lovedOneProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  personality: {
    type: String,
    required: true,
  },
  habits: {
    type: String,
    required: true,
  },
  commonPhrases: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'female',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LovedOneProfile = mongoose.model('LovedOneProfile', lovedOneProfileSchema);
module.exports = LovedOneProfile;
