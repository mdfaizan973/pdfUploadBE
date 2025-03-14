// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");

// const userRoutes = require("./routes/userRoutes");
// const fileRoutes = require("./routes/fileRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Database Connection
// connectDB();

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/files", fileRoutes);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
const fs = require("fs"); // Import fs module
const path = require("path");
const routerFeedback = require("./routes/feedbackRoutes");

const app = express();

// Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// const corsConfig = {
//   origin: "*",
//   credential: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
// Middleware
// app.options("", cors(corsConfig));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Serve uploaded files

const API_KEY = "J9XqP7ZkY3LgN5V2TBR6ChQ84WmKxDFoUCMtA1EGBzvpNdWYmdFaizan973";

const verifyApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ message: "Access Denied: Invalid API Key" });
  }
  next();
};

app.get("/", (req, res) => {
  try {
    res.send("This is DosDrop");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Routes
app.use("/api/files", verifyApiKey, fileRoutes);
app.use("/api/users", verifyApiKey, userRoutes);
app.use("/api/feedback", verifyApiKey, routerFeedback);

// Connect to MongoDB
connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
