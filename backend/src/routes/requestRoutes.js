const express = require("express");
const {
  createRequest,
  listRequests,
  respondToRequest
} = require("../controllers/requestsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, createRequest);
router.get("/", requireAuth, listRequests);
router.patch("/:id/respond", requireAuth, respondToRequest);

module.exports = router;
