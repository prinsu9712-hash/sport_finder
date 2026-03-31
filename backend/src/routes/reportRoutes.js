const express = require("express");
const {
  createReport,
  listReports
} = require("../controllers/reportsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, createReport);
router.get("/", requireAuth, requireRole("admin"), listReports);

module.exports = router;
