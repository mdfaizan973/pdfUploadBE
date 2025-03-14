const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true } 
);

const modelFeedback = mongoose.model("feedback", feedbackSchema);

module.exports = modelFeedback;