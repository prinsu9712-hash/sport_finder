require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDatabase = require("./src/config/db");
const Message = require("./src/models/Message");

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const requiredEnv = ["JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

const socketOrigins = ["http://localhost:3000", "http://localhost:3001"];

if (process.env.CLIENT_URL) {
  socketOrigins.push(process.env.CLIENT_URL);
}

if (process.env.FRONTEND_URL) {
  socketOrigins.push(process.env.FRONTEND_URL);
}

for (const origin of (process.env.FRONTEND_URLS || "").split(",")) {
  const trimmedOrigin = origin.trim();
  if (trimmedOrigin) {
    socketOrigins.push(trimmedOrigin);
  }
}

const io = new Server(server, {
  cors: {
    origin: Array.from(new Set(socketOrigins)),
    methods: ["GET", "POST", "PATCH"]
  }
});

global.io = io;
app.locals.io = io;

io.on("connection", (socket) => {
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user:${userId}`);
    socket.join(userId);
  });

  socket.on("user:join", (userId) => {
    socket.join(`user:${userId}`);
    socket.join(userId);
  });

  socket.on("request:send", ({ toUserId, payload }) => {
    io.to(`user:${toUserId}`).emit("request:new", payload);
  });

  socket.on("chat:send", async (payload) => {
    if (!payload?.sender || !payload?.receiver || !payload?.text) {
      return;
    }

    const message = await Message.create({
      sender: payload.sender,
      receiver: payload.receiver,
      text: payload.text
    });

    const populated = await message.populate("sender receiver", "name email");
    io.to(`user:${payload.receiver}`).emit("chat:message", populated.toObject());
    io.to(`user:${payload.sender}`).emit("chat:message", populated.toObject());
  });

  socket.on("video:signal", ({ toUserId, signal, fromUserId }) => {
    io.to(`user:${toUserId}`).emit("video:signal", { signal, fromUserId });
  });
});

async function startServer() {
  if (missingEnv.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnv.join(", ")}`
    );
    process.exit(1);
  }

  try {
    await connectDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
