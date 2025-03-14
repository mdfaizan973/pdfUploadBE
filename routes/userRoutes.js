const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  const { name, email, copypass, role_id, gender, limits, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        name: name || null,
        email: email || null,
        password: hashedPassword || null,
        role_id: role_id || null,
        gender: gender || null,
        limits: limits || null,
        copypass: copypass || null
    }
    user = new User(newUser);

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ user: { id: user.id } }, "yourSecretKey", {
      expiresIn: "1h",
    });

    res.json({ token, 
        userDetails: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            limits: user.limits,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            __v: user.__v,
          }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// **Get User**
router.get("/", async (req, res) => {
    try {

        const users = await User.find();

        // const updatedUsers = users.map(user => ({
        //     ...user.toObject(),
        //     copypass: user.copypass || user.password,
        //     role_id: user.role_id || null
        // }));
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
})

// **Delete User**
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// **Edit User**
router.put("/:id", async (req, res) => {
    try {
        const { name, email, role_id, gender, limits } = req.body;

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role_id, gender, limits },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

