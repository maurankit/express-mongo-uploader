require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const videoRoutes = require('./routes/video');
const app = express();
const path = require("path");
const fs = require('fs');
const env_config = require('./config/cred')


// upload directory 
const uploadDir = path.join(__dirname, env_config.UPLOAD_DIR || "uploads");

// checking if directory not exist then create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

connectDB();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', videoRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = env_config.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
