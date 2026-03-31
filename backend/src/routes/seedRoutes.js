const express = require("express");
const { seedDatabase } = require("../seed/seedService");

const router = express.Router();

router.post("/", async (_req, res) => {
  const summary = await seedDatabase();
  res.status(201).json(summary);
});

module.exports = router;
