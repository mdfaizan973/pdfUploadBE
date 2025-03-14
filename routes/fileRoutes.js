const express = require("express");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const File = require("../models/File");

const router = express.Router();

// Upload File
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extracting metadata from the request body
    const { userId, userName, userEmail, title, description } = req.body;

    const fileUrl = `/uploads/${req.file.filename}`;

    const newFile = new File({
      userId: userId || null,
      userName: userName || null,
      userEmail: userEmail || null,
      title: title || null,
      description: description || null,
      filename: req.file.filename || null,
      fileUrl: fileUrl || null,
    });

    await newFile.save();
    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve uploaded files correctly
router.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.sendFile(filePath);
});

// **Download File Route**
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath, req.params.filename, (err) => {
    if (err) {
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from request query

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const files = await File.find({ userId }); // Filter files by userId
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await File.findByIdAndDelete(id);
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
