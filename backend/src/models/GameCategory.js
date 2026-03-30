const mongoose = require("mongoose");

const gameCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["indoor", "outdoor"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameCategory", gameCategorySchema);
