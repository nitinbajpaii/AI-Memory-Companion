const Memory = require('../models/Memory');

const addMemory = async (req, res) => {
  const { lovedOneId, memoryText, emotionTag } = req.body;

  try {
    const memory = await Memory.create({
      userId: req.user._id,
      lovedOneId,
      memoryText,
      emotionTag,
    });
    res.status(201).json(memory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ userId: req.user._id });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (memory) {
      if (memory.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await memory.deleteOne();
      res.json({ message: 'Memory removed' });
    } else {
      res.status(404).json({ message: 'Memory not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMemory, getMemories, deleteMemory };
