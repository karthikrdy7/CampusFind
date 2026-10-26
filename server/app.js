const express = require("express");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
let connectionPromise;

app.use(express.json({ limit: "100kb" }));
app.get("/", (_req, res) => {
  res.json({ message: "CampusFind API is running." });
});

app.use("/api/items", (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  if (!process.env.MONGO_URI) {
    return res.status(503).json({ message: "Database is not configured." });
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  connectionPromise
    .then(() => next())
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      res.status(503).json({ message: "Database is unavailable." });
    });
});
app.use("/api/items", itemRoutes);

module.exports = app;
