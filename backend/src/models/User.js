const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const availabilitySchema = new mongoose.Schema(
  {
    days: [{ type: String, required: true }],
    timeSlot: { type: String, required: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    gender: {
      type: String,
      enum: ["woman", "man", "other"],
      default: "woman"
    },
    role: {
      type: String,
      enum: ["user", "organizer", "admin"],
      default: "user"
    },
    location: { type: String, required: true },
    preferredGames: [{ type: String, required: true }],
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true
    },
    availability: { type: availabilitySchema, required: true },
    preferredLocations: [{ type: String, required: true }],
    bio: { type: String, default: "" },
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
