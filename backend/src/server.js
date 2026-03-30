require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/db");
const configureSocket = require("./socket");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  const server = http.createServer(app);
  configureSocket(server, app);
  server.listen(PORT, () => {
    console.log(`PlayCircle backend listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
