const Message = require("../models/Message");

async function listMessages(req, res) {
  const withUser = req.query.withUser;

  const query = withUser
    ? {
        $or: [
          { sender: req.user._id, receiver: withUser },
          { sender: withUser, receiver: req.user._id }
        ]
      }
    : {
        $or: [{ sender: req.user._id }, { receiver: req.user._id }]
      };

  const messages = await Message.find(query)
    .populate("sender receiver", "name email")
    .sort({ createdAt: 1 });

  return res.json(messages);
}

async function createMessage(req, res) {
  const message = await Message.create({
    sender: req.user._id,
    receiver: req.body.receiver,
    text: req.body.text
  });

  const populated = await message.populate("sender receiver", "name email");

  if (req.app.locals.io) {
    req.app.locals.io
      .to(`user:${req.body.receiver}`)
      .emit("chat:message", populated.toObject());
  }

  return res.status(201).json(populated);
}

module.exports = {
  listMessages,
  createMessage
};
