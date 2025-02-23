const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Registration = require("../models/registration");
const { default: mongoose } = require("mongoose");
const router = express.Router();
require('dotenv').config();

const mongo_url = process.env.MONGO_URI;

//---------------------------------register user--------------------------
router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match." });
    }

    await mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
    const existingUser = await Registration.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    const newUser = new Registration({
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  } finally {
    await mongoose.disconnect();
  }
});

//---------------------------------login user--------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });

    const user = await Registration.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});
module.exports = router;
