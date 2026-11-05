
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://campus-find-flame.vercel.app"
];

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

// Handle preflight requests
app.options(/.*/, cors({
  origin: allowedOrigins
}));

app.use(express.json({ limit: "100kb" }));

// Health check
app.get("/", (_req, res) => {
  res.json({
    message: "CampusFind API is running."
  });
});

// Reuse MongoDB connection
let connectionPromise;

app.use("/api/items", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    if (!process.env.MONGO_URI) {
      return res.status(503).json({
        message: "Database is not configured."
      });
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.MONGO_URI)
        .catch((error) => {
          connectionPromise = null;
          throw error;
        });
    }

    await connectionPromise;
    next();

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(503).json({
      message: "Database is unavailable."
    });
  }
});

// API routes
app.use("/api/items", itemRoutes);

module.exports = app;
