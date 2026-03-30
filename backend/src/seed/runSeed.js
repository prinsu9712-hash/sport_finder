require("dotenv").config();
const connectDatabase = require("../config/db");
const { seedDatabase } = require("./seedService");

async function runSeed() {
  await connectDatabase();
  const summary = await seedDatabase();
  console.log("Seed complete", summary);
  process.exit(0);
}

runSeed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
