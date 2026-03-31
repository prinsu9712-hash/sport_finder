const mongoose = require("mongoose");

async function connectDatabase() {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_FALLBACK_URI;
  const isProduction = process.env.NODE_ENV === "production";

  if (!primaryUri && !fallbackUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected using primary URI");
  } catch (error) {
    if (isProduction || !fallbackUri) {
      throw error;
    }

    console.warn(
      `Primary MongoDB connection failed. Falling back to local MongoDB. ${error.message}`
    );
    await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB connected using fallback URI");
  }
}

module.exports = connectDatabase;
