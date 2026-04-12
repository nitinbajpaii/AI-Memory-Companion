const LovedOneProfile = require('../models/LovedOneProfile');

const createProfile = async (req, res) => {
  const { name, relation, personality, habits, commonPhrases } = req.body;

  try {
    const profile = await LovedOneProfile.create({
      userId: req.user._id,
      name,
      relation,
      personality,
      habits,
      commonPhrases,
    });
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await LovedOneProfile.findOne({ userId: req.user._id });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, relation, personality, habits, commonPhrases } = req.body;

  try {
    const profile = await LovedOneProfile.findById(req.params.id);

    if (profile) {
      if (profile.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      profile.name = name || profile.name;
      profile.relation = relation || profile.relation;
      profile.personality = personality || profile.personality;
      profile.habits = habits || profile.habits;
      profile.commonPhrases = commonPhrases || profile.commonPhrases;

      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile, getProfile, updateProfile };
