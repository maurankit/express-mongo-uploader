const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true,
  },
  name: { type: String, required: true },
  profileImage: { type: String },
  about: { type: String },
});
module.exports = mongoose.model("Profile", profileSchema);
