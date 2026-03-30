const User = require("../models/User");
const { signToken } = require("../middleware/auth");

function normalizeProfileInput(body) {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    gender: body.gender || "woman",
    role: body.role || "user",
    location: body.location,
    preferredGames: body.preferredGames || [],
    skillLevel: body.skillLevel || "beginner",
    availability: {
      days: body.availability?.days || [],
      timeSlot: body.availability?.timeSlot || ""
    },
    preferredLocations: body.preferredLocations || [],
    bio: body.bio || ""
  };
}

async function register(req, res) {
  const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const user = await User.create(normalizeProfileInput(req.body));
  const token = signToken(user);

  return res.status(201).json({
    token,
    user: user.toSafeObject()
  });
}

async function login(req, res) {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const matches = await user.comparePassword(req.body.password);

  if (!matches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user);

  return res.json({
    token,
    user: user.toSafeObject()
  });
}

async function getMe(req, res) {
  const hydratedUser = await User.findById(req.user._id).populate(
    "communities",
    "name area"
  );
  return res.json(hydratedUser.toSafeObject());
}

module.exports = {
  register,
  login,
  getMe
};
