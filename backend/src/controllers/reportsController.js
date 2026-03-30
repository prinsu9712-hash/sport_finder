const Report = require("../models/Report");

async function createReport(req, res) {
  const report = await Report.create({
    reporter: req.user._id,
    targetUser: req.body.targetUser || undefined,
    reason: req.body.reason,
    details: req.body.details || ""
  });

  return res.status(201).json(report);
}

async function listReports(_req, res) {
  const reports = await Report.find()
    .populate("reporter", "name email")
    .populate("targetUser", "name email")
    .sort({ createdAt: -1 });

  return res.json(reports);
}

module.exports = {
  createReport,
  listReports
};
