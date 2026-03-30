const GameCategory = require("../models/GameCategory");

async function listGames(_req, res) {
  const games = await GameCategory.find().sort({ name: 1 });
  res.json(games);
}

async function createGame(req, res) {
  const game = await GameCategory.create(req.body);
  return res.status(201).json(game);
}

module.exports = {
  listGames,
  createGame
};
