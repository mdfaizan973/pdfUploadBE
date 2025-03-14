const express = require("express");
const routerFeedback = express.Router();
const modelFeedback = require("../models/Feedback");

// ✅ Create Feedback (POST /api/feedback)
routerFeedback.post("/", async (req, res) => {
    try {
        const { name, review } = req.body;
        const newFeedback = new modelFeedback({ name, review });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback added successfully", newFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Read All Feedback (GET /api/feedback)
routerFeedback.get("/", async (req, res) => {
    try {
        const feedbacks = await modelFeedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Read Single Feedback by ID (GET /api/feedback/:id)
routerFeedback.get("/:id", async (req, res) => {
    try {
        const feedback = await modelFeedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Update Feedback by ID (PUT /api/feedback/:id)
routerFeedback.put("/:id", async (req, res) => {
    try {
        const { name, review } = req.body;
        const updatedFeedback = await modelFeedback.findByIdAndUpdate(
            req.params.id,
            { name, review },
            { new: true, runValidators: true }
        );
        if (!updatedFeedback) return res.status(404).json({ message: "Feedback not found" });
        res.status(200).json({ message: "Feedback updated", updatedFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Delete Feedback by ID (DELETE /api/feedback/:id)
routerFeedback.delete("/:id", async (req, res) => {
    try {
        const deletedFeedback = await modelFeedback.findByIdAndDelete(req.params.id);
        if (!deletedFeedback) return res.status(404).json({ message: "Feedback not found" });
        res.status(200).json({ message: "Feedback deleted", deletedFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

module.exports = routerFeedback;
