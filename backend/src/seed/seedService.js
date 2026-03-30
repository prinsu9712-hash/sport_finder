const Community = require("../models/Community");
const GameCategory = require("../models/GameCategory");
const PlayRequest = require("../models/PlayRequest");
const User = require("../models/User");
const { communities, gameCategories, users } = require("./data");

async function seedDatabase() {
  await Promise.all([
    Community.deleteMany({}),
    GameCategory.deleteMany({}),
    PlayRequest.deleteMany({}),
    User.deleteMany({})
  ]);

  const insertedGames = await GameCategory.insertMany(gameCategories);
  const insertedCommunities = await Community.insertMany(communities);
  const insertedUsers = [];

  for (const user of users) {
    const createdUser = await User.create(user);
    insertedUsers.push(createdUser);
  }

  await PlayRequest.insertMany([
    {
      requester: insertedUsers[0]._id,
      recipient: insertedUsers[2]._id,
      game: "Badminton",
      venue: "Skyline Society Clubhouse",
      scheduledFor: new Date("2026-04-03T18:30:00.000Z"),
      status: "pending",
      notes: "Friendly doubles practice."
    },
    {
      requester: insertedUsers[1]._id,
      recipient: insertedUsers[0]._id,
      game: "Chess",
      venue: "Community Reading Lounge",
      scheduledFor: new Date("2026-04-05T17:00:00.000Z"),
      status: "accepted",
      notes: "Weekend strategic session."
    }
  ]);

  return {
    games: insertedGames.length,
    communities: insertedCommunities.length,
    users: insertedUsers.length,
    requests: 2
  };
}

module.exports = { seedDatabase };
