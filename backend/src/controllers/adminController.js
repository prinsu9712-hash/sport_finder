const User = require("../models/User");
const PlayRequest = require("../models/PlayRequest");
const Community = require("../models/Community");
const GameCategory = require("../models/GameCategory");
const Report = require("../models/Report");

async function getAdminOverview(_req, res) {
  const [users, pendingRequests, totalRequests, communities, games, accepted, reports] =
    await Promise.all([
      User.countDocuments(),
      PlayRequest.countDocuments({ status: "pending" }),
      PlayRequest.countDocuments(),
      Community.countDocuments(),
      GameCategory.countDocuments(),
      PlayRequest.countDocuments({ status: "accepted" }),
      Report.countDocuments({ status: { $ne: "resolved" } })
    ]);

  const successfulMatchRate =
    totalRequests === 0 ? 0 : Math.round((accepted / totalRequests) * 100);

  res.json({
    users,
    pendingRequests,
    totalRequests,
    communities,
    games,
    successfulMatchRate,
    openReports: reports
  });
}

module.exports = {
  getAdminOverview
};
