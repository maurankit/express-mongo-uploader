const express = require("express");
const multer = require("multer");
const Video = require("../models/video");
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
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

//-----------------------------upload video--------------------------
router.post(
  "/videos",
  auth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const video = new Video({
        user: req.user.userId,
        title,
        description,
        videoUrl: req.files.video[0].filename,
        thumbnailUrl: req.files.thumbnail ? req.files.thumbnail[0].filename : null,
      });
      await video.save();
      res.status(201).json(video);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Error uploading video" });
    }
  }
);

//-----------------------------get videos--------------------------
router.get("/videos", auth, async (req, res) => {
  try {
    let data
    if(req.query.id){
      console.log("req.query.id", req.query.id);
       data = await Video.findOne({ user: req.user.userId, _id: req.query.id });
    }else{
      console.log("req.user.userId", req.user.userId);
       data = await Video.find({ user: req.user.userId });
      }
      return res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});
module.exports = router;
