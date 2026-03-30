const PlayRequest = require("../models/PlayRequest");

async function createRequest(req, res) {
  const request = await PlayRequest.create({
    requester: req.user._id,
    recipient: req.body.recipient,
    game: req.body.game,
    venue: req.body.venue,
    scheduledFor: req.body.scheduledFor,
    status: "pending",
    notes: req.body.notes || ""
  });
  const populated = await request.populate("requester recipient");

  if (req.app.locals.io) {
    req.app.locals.io
      .to(`user:${req.body.recipient}`)
      .emit("request:new", populated.toObject());
  }

  res.status(201).json(populated);
}

async function listRequests(req, res) {
  const { status } = req.query;
  const query = {
    $or: [{ requester: req.user._id }, { recipient: req.user._id }]
  };

  if (status) {
    query.status = status;
  }

  const requests = await PlayRequest.find(query)
    .populate("requester recipient")
    .sort({ scheduledFor: 1 });
  res.json(requests);
}

async function respondToRequest(req, res) {
  const { status } = req.body;
  const request = await PlayRequest.findById(req.params.id).populate(
    "requester recipient"
  );

  if (!request) {
    return res.status(404).json({ message: "Play request not found" });
  }

  if (request.recipient._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only the recipient can respond" });
  }

  request.status = status;
  await request.save();
  return res.json(request);
}

module.exports = {
  createRequest,
  listRequests,
  respondToRequest
};
