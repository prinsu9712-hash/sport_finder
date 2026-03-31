const express = require("express");
const {
  createCommunity,
  listCommunities,
  joinCommunity
} = require("../controllers/communitiesController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, requireRole("organizer", "admin"), createCommunity);
router.get("/", listCommunities);
router.post("/:id/join", requireAuth, joinCommunity);

module.exports = router;
