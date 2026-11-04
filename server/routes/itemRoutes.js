
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");

const Item = require("../models/Item");

const router = express.Router();

// ========================================
// MULTER CONFIGURATION
// ========================================

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 4 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported image type: ${file.mimetype}`
        )
      );
    }
  },
});

// ========================================
// GRIDFS CONFIGURATION
// ========================================

const getBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB database is not connected.");
  }

  return new GridFSBucket(mongoose.connection.db, {
    bucketName: "itemImages",
  });
};

// ========================================
// IMAGE CONTENT TYPE DETECTION
// ========================================

const getImageContentType = (file) => {
  // First check stored metadata
  if (allowedTypes.includes(file.metadata?.contentType)) {
    return file.metadata.contentType;
  }

  // Support older files
  if (allowedTypes.includes(file.contentType)) {
    return file.contentType;
  }

  // Detect from filename
  const filename = file.filename?.toLowerCase() || "";

  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (filename.endsWith(".png")) {
    return "image/png";
  }

  if (filename.endsWith(".webp")) {
    return "image/webp";
  }

  if (filename.endsWith(".gif")) {
    return "image/gif";
  }

  return null;
};

// ========================================
// EDITABLE ITEM FIELDS
// ========================================

const editableFields = [
  "itemName",
  "type",
  "category",
  "description",
  "location",
  "date",
  "color",
  "contact",
  "image",
  "status",
];

const getEditableFields = (body) =>
  Object.fromEntries(
    editableFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );

// ========================================
// POST - UPLOAD IMAGE TO GRIDFS
// ========================================

router.post(
  "/upload",

  (req, res, next) => {
    upload.single("image")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      next();
    });
  },

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image.",
        });
      }

      const bucket = getBucket();

      const fileId = new mongoose.Types.ObjectId();

      const uploadStream = bucket.openUploadStream(
        req.file.originalname,
        {
          id: fileId,

          metadata: {
            contentType: req.file.mimetype,
            uploadedAt: new Date(),
          },
        }
      );

      uploadStream.on("error", (error) => {
        console.error("Image upload error:", error);

        if (!res.headersSent) {
          res.status(500).json({
            message: "Image upload failed.",
          });
        }
      });

      uploadStream.on("finish", () => {
        res.status(201).json({
          message: "Image uploaded successfully.",
          imageId: fileId.toString(),
        });
      });

      Readable.from(req.file.buffer).pipe(uploadStream);

    } catch (error) {
      console.error("Upload error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to upload image.",
        });
      }
    }
  }
);

// ========================================
// GET - RETRIEVE IMAGE FROM GRIDFS
// ========================================

router.get("/image/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid image ID.",
      });
    }

    const bucket = getBucket();

    const imageId = new mongoose.Types.ObjectId(
      req.params.id
    );

    const files = await bucket
      .find({ _id: imageId })
      .toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Image not found.",
      });
    }

    const contentType = getImageContentType(files[0]);

    if (!contentType) {
      return res.status(415).json({
        message: "Unsupported image type.",
      });
    }

    res.set("Content-Type", contentType);
    res.set("Content-Disposition", "inline");
    res.set("X-Content-Type-Options", "nosniff");

    const downloadStream = bucket.openDownloadStream(imageId);

    downloadStream.on("error", (error) => {
      console.error("Image download error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to retrieve image.",
        });
      } else {
        res.destroy(error);
      }
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error("Image retrieval error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to retrieve image.",
      });
    }
  }
});

// ========================================
// GET - ALL ITEMS
// ========================================

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({
      createdAt: -1,
    });

    res.status(200).json(items);

  } catch (error) {
    console.error("Fetch items error:", error);

    res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
});

// ========================================
// GET - SINGLE ITEM
// ========================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID.",
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(item);

  } catch (error) {
    console.error("Fetch item error:", error);

    res.status(400).json({
      message: "Failed to fetch item",
      error: error.message,
    });
  }
});

// ========================================
// POST - CREATE ITEM
// ========================================

router.post("/", async (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "A JSON object is required.",
      });
    }

    const newItem = new Item(
      getEditableFields(req.body)
    );

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);

  } catch (error) {
    console.error("Create item error:", error);

    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
});

// ========================================
// PUT - UPDATE ITEM
// ========================================

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID.",
      });
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "A JSON object is required.",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      getEditableFields(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(updatedItem);

  } catch (error) {
    console.error("Update item error:", error);

    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
});

// ========================================
// DELETE - ITEM
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid item ID.",
      });
    }

    const deletedItem = await Item.findByIdAndDelete(
      req.params.id
    );

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Delete associated GridFS image
    if (
      deletedItem.image &&
      mongoose.isValidObjectId(deletedItem.image)
    ) {
      try {
        await getBucket().delete(
          new mongoose.Types.ObjectId(deletedItem.image)
        );

      } catch (imageError) {
        console.error(
          "Could not delete associated image:",
          imageError.message
        );
      }
    }

    res.status(200).json({
      message: "Item deleted successfully",
      item: deletedItem,
    });

  } catch (error) {
    console.error("Delete item error:", error);

    res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
});

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;
