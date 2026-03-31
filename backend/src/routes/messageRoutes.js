const express = require("express");
const {
  listMessages,
  createMessage
} = require("../controllers/messagesController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, listMessages);
router.post("/", requireAuth, createMessage);

module.exports = router;
