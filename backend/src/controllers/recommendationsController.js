const User = require("../models/User");

async function recommendForCurrentUser(req, res) {
  const currentUser = req.user;

  const users = await User.find({
    _id: { $ne: currentUser._id },
    preferredGames: { $in: currentUser.preferredGames },
    skillLevel: currentUser.skillLevel,
    location: { $regex: currentUser.location.split(",")[0], $options: "i" }
  }).limit(10);

  return res.json(users);
}

module.exports = {
  recommendForCurrentUser
};
