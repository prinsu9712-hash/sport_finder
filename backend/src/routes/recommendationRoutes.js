const express = require("express");
const {
  recommendForCurrentUser
} = require("../controllers/recommendationsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, recommendForCurrentUser);

module.exports = router;
