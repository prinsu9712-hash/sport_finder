const Community = require("../models/Community");

async function createCommunity(req, res) {
  const community = await Community.create({
    ...req.body,
    organizer: req.user?._id
  });
  res.status(201).json(community);
}

async function listCommunities(_req, res) {
  const communities = await Community.find().sort({ createdAt: -1 });
  res.json(communities);
}

async function joinCommunity(req, res) {
  const User = require("../models/User");
  const community = await Community.findById(req.params.id);

  if (!community) {
    return res.status(404).json({ message: "Community not found" });
  }

  const alreadyJoined = req.user.communities.some(
    (communityId) => communityId.toString() === community._id.toString()
  );

  if (!alreadyJoined) {
    req.user.communities.push(community._id);
    await req.user.save();
  }

  const refreshedUser = await User.findById(req.user._id).populate("communities");
  return res.json(refreshedUser.toSafeObject());
}

module.exports = {
  createCommunity,
  listCommunities,
  joinCommunity
};
