const { Server } = require("socket.io");
const Message = require("./models/Message");

function configureSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*"
    }
  });

  io.on("connection", (socket) => {
    socket.on("user:join", (userId) => {
      socket.join(`user:${userId}`);
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

  app.locals.io = io;
  return io;
}

module.exports = configureSocket;
