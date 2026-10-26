const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    date: {
      type: Date,
      required: true,
    },

    color: {
      type: String,
      default: "",
      trim: true,
      maxlength: 60,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Recovered"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);