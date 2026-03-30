const express = require("express");
const { listGames, createGame } = require("../controllers/gamesController");
const {
  register,
  login,
  getMe
} = require("../controllers/authController");
const {
  registerUser,
  listUsers,
  discoverUsers,
  updateProfile,
  getMatchHistory
} = require("../controllers/usersController");
const {
  createRequest,
  listRequests,
  respondToRequest
} = require("../controllers/requestsController");
const {
  createCommunity,
  listCommunities,
  joinCommunity
} = require("../controllers/communitiesController");
const { getAdminOverview } = require("../controllers/adminController");
const {
  createReport,
  listReports
} = require("../controllers/reportsController");
const {
  listMessages,
  createMessage
} = require("../controllers/messagesController");
const {
  recommendForCurrentUser
} = require("../controllers/recommendationsController");
const { requireAuth, requireRole } = require("../middleware/auth");
const { seedDatabase } = require("../seed/seedService");

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", requireAuth, getMe);

router.get("/games", listGames);
router.post("/games", requireAuth, requireRole("admin"), createGame);

router.post("/users/register", registerUser);
router.get("/users", listUsers);
router.get("/users/discover", discoverUsers);
router.get("/users/history", requireAuth, getMatchHistory);
router.patch("/users/me", requireAuth, updateProfile);

router.post("/requests", requireAuth, createRequest);
router.get("/requests", requireAuth, listRequests);
router.patch("/requests/:id/respond", requireAuth, respondToRequest);

router.post(
  "/communities",
  requireAuth,
  requireRole("organizer", "admin"),
  createCommunity
);
router.get("/communities", listCommunities);
router.post("/communities/:id/join", requireAuth, joinCommunity);

router.post("/reports", requireAuth, createReport);

router.get("/messages", requireAuth, listMessages);
router.post("/messages", requireAuth, createMessage);

router.get(
  "/recommendations/me",
  requireAuth,
  recommendForCurrentUser
);

router.get("/admin/overview", requireAuth, requireRole("admin"), getAdminOverview);
router.get("/admin/reports", requireAuth, requireRole("admin"), listReports);
router.post("/seed", async (_req, res) => {
  const summary = await seedDatabase();
  res.status(201).json(summary);
});

module.exports = router;
