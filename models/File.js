const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false },
    userName: { type: String, required: false },
    userEmail: { type: String, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("File", fileSchema);
