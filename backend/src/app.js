const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRouter = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*"
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "PlayCircle API",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Unexpected server error"
  });
});

module.exports = app;
