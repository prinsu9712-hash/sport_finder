const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    description: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    supportedGames: [{ type: String, required: true }],
    recurringSlot: { type: String, default: "" },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);
