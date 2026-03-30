const User = require("../models/User");

async function registerUser(req, res) {
  const user = await User.create(req.body);
  res.status(201).json(user.toSafeObject());
}

async function listUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
}

async function discoverUsers(req, res) {
  const { game, location, skill, day } = req.query;
  const query = {};

  if (game) {
    query.preferredGames = game;
  }

  if (location) {
    query.$or = [
      { location: { $regex: location, $options: "i" } },
      { preferredLocations: { $in: [location] } }
    ];
  }

  if (skill) {
    query.skillLevel = skill.toLowerCase();
  }

  if (day) {
    query["availability.days"] = day;
  }

  const users = await User.find(query).limit(25);
  res.json(users);
}

async function updateProfile(req, res) {
  const allowedFields = [
    "name",
    "gender",
    "location",
    "preferredGames",
    "skillLevel",
    "availability",
    "preferredLocations",
    "bio"
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  return res.json(req.user.toSafeObject());
}

async function getMatchHistory(req, res) {
  const PlayRequest = require("../models/PlayRequest");
  const history = await PlayRequest.find({
    $or: [{ requester: req.user._id }, { recipient: req.user._id }]
  })
    .populate("requester recipient", "name email location")
    .sort({ scheduledFor: -1 });

  return res.json(history);
}

module.exports = {
  registerUser,
  listUsers,
  discoverUsers,
  updateProfile,
  getMatchHistory
};
