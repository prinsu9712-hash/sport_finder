const express = require("express");
const { getAdminOverview } = require("../controllers/adminController");
const { listReports } = require("../controllers/reportsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/overview", requireAuth, requireRole("admin"), getAdminOverview);
router.get("/reports", requireAuth, requireRole("admin"), listReports);

module.exports = router;
