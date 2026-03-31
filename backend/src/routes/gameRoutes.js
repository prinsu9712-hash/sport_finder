const express = require("express");
const { listGames, createGame } = require("../controllers/gamesController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", listGames);
router.post("/", requireAuth, requireRole("admin"), createGame);

module.exports = router;
