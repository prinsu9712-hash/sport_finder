const express = require("express");
const {
  registerUser,
  listUsers,
  discoverUsers,
  updateProfile,
  getMatchHistory
} = require("../controllers/usersController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.get("/", listUsers);
router.get("/discover", discoverUsers);
router.get("/history", requireAuth, getMatchHistory);
router.patch("/me", requireAuth, updateProfile);

module.exports = router;
