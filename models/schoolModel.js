const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema({
  doe_code: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  },
  zip_code: {
    type: Number,
    trim: true,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  fax: {
    type: String,
    required: true,
    trim: true,
  },
  grade_from: {
    type: String,
    required: true,
    trim: true
  },
  grade_to: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
  },
  complex: {
    type: String,
    required: true
  },
  island: {
    type: String,
    required: true
  },
  charter: {
    type: Boolean,
    default: false
  },
  esis_name: {
    type: String,
    required: true,
    trim: true
  },
  principal: {
    type: String,
  },
  images: {
    type: Object,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  year_built: {
    type: Number
  },
},
  {
    timestamps: true
  })

module.exports = mongoose.model("Schools", schoolSchema)