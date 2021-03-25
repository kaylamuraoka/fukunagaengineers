const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Pleasae enter your email!"],
    trim: true,
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number!"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
  },
  role: {
    type: Number,
    default: 0 // 0=user, 1=admin
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dprurap3r/image/upload/v1616619478/avatar/avatar-placeholder_ffoxxp.png"
  },
}, {
  timestamps: true
})

module.exports = User = mongoose.model("Users", userSchema)