const RoommateProfile = require('../models/RoommateProfile');

// --- Helper: Cosine Similarity ---
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- Helper: Encode Profile to Vector ---
function encodeProfile(profile) {
  // Feature vector structure: [smoking, drinking, sleepingHabits, cleanliness]
  const smokingVal = profile.smoking ? 1 : 0;
  const drinkingVal = profile.drinking ? 1 : 0;
  
  let sleepVal = 0.5; // Flexible
  if (profile.sleepingHabits === 'Early Bird') sleepVal = 1;
  else if (profile.sleepingHabits === 'Night Owl') sleepVal = 0;

  let cleanVal = 0.5; // Average
  if (profile.cleanliness === 'Very Clean') cleanVal = 1;
  else if (profile.cleanliness === 'Messy') cleanVal = 0;

  // Adding a bias of 0.1 to avoid zero vectors which cause NaN in cosine similarity
  return [smokingVal + 0.1, drinkingVal + 0.1, sleepVal + 0.1, cleanVal + 0.1];
}

// @route   GET /api/roommates/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const profile = await RoommateProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/roommates/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const {
      gender, lookingForGender, budgetMin, budgetMax,
      smoking, drinking, sleepingHabits, cleanliness, bio
    } = req.body;

    let profile = await RoommateProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile.gender = gender || profile.gender;
      profile.lookingForGender = lookingForGender || profile.lookingForGender;
      profile.budgetMin = budgetMin !== undefined ? budgetMin : profile.budgetMin;
      profile.budgetMax = budgetMax !== undefined ? budgetMax : profile.budgetMax;
      profile.smoking = smoking !== undefined ? smoking : profile.smoking;
      profile.drinking = drinking !== undefined ? drinking : profile.drinking;
      profile.sleepingHabits = sleepingHabits || profile.sleepingHabits;
      profile.cleanliness = cleanliness || profile.cleanliness;
      profile.bio = bio || profile.bio;
      await profile.save();
    } else {
      // Create
      profile = await RoommateProfile.create({
        user: req.user._id,
        gender, lookingForGender, budgetMin, budgetMax,
        smoking, drinking, sleepingHabits, cleanliness, bio
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/roommates/matches
// @access  Private
const getMatches = async (req, res, next) => {
  try {
    const myProfile = await RoommateProfile.findOne({ user: req.user._id });
    if (!myProfile) {
      return res.status(400).json({ message: 'You must create a profile first to find matches.' });
    }

    // 1. Fetch all other profiles
    const allProfiles = await RoommateProfile.find({ user: { $ne: req.user._id } }).populate('user', 'name email avatar phone');

    // 2. Filter hard constraints
    const potentialMatches = allProfiles.filter(p => {
      // Gender filter
      if (myProfile.lookingForGender !== 'Any' && p.gender !== myProfile.lookingForGender) return false;
      if (p.lookingForGender !== 'Any' && myProfile.gender !== p.lookingForGender) return false;
      
      // Budget overlap filter (optional, but good for exact matching)
      // Two ranges [A, B] and [C, D] overlap if Math.max(A, C) <= Math.min(B, D)
      const maxMin = Math.max(myProfile.budgetMin, p.budgetMin);
      const minMax = Math.min(myProfile.budgetMax, p.budgetMax);
      if (maxMin > minMax) return false; // No budget overlap

      return true;
    });

    // 3. ML Scoring (Cosine Similarity)
    const myVector = encodeProfile(myProfile);
    
    const matchesWithScores = potentialMatches.map(p => {
      const pVector = encodeProfile(p);
      let score = cosineSimilarity(myVector, pVector);
      
      // Convert cosine similarity [-1, 1] to percentage [0, 100]
      // Since our vectors are all positive (thanks to bias), dot product is >= 0, so score is in [0, 1]
      let percentage = Math.round(score * 100);
      
      return {
        profile: p,
        matchPercentage: percentage
      };
    });

    // 4. Sort by highest match percentage
    matchesWithScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(matchesWithScores);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getMatches };
