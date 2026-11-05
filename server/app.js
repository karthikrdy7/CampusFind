
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

let connectionPromise;

// Enable CORS before API routes
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://campus-find-flame.vercel.app"
  ]
}));

app.use(express.json({ limit: "100kb" }));

// Home route
app.get("/", (_req, res) => {
  res.json({
    message: "CampusFind API is running.",
  });
});

// Connect MongoDB before processing API requests
app.use("/api/items", (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  if (!process.env.MONGO_URI) {
    return res.status(503).json({
      message: "Database is not configured.",
    });
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  connectionPromise
    .then(() => next())
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);

      res.status(503).json({
        message: "Database is unavailable.",
      });
    });
});

// Item and image routes
app.use("/api/items", itemRoutes);

module.exports = app;
