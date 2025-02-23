const express = require("express");
const multer = require("multer");
const Profile = require("../models/profile");
const auth = require("../middleware/auth");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueFilename = `${Date.now()}${ext}-${file.originalname}`;
    cb(null, uniqueFilename); 
  },
});

const upload = multer({
  storage: storage, 
});

//-----------------------------create profile--------------------------
router.post(
  "/profile",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      console.log('inside profile update')
      const { name, about } = req.body;
      const profileImage = req.file ? req.file.filename : null;
      const profile = new Profile({
        user: req.user.userId,
        name,
        about,
        profileImage,
      });
      await profile.save();
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error creating profile" });
    }
  }
);

//-----------------------------get profile--------------------------
router.get("/profile", auth, async (req, res) => {
  try {
    console.log('insid profile request')
    const profile = await Profile.findOne({ user: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});
module.exports = router;
