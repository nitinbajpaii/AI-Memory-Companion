const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lovedOneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LovedOneProfile',
    required: true,
  },
  memoryText: {
    type: String,
    required: true,
  },
  emotionTag: {
    type: String,
    enum: ['happy', 'sad', 'nostalgic', 'funny', 'meaningful'],
    default: 'meaningful',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Memory = mongoose.model('Memory', memorySchema);
module.exports = Memory;
