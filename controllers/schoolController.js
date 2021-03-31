const Schools = require('../models/schoolModel')

const schoolController = {
  getSchools: async (req, res) => {
    try {

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  createSchool: async (req, res) => {
    try {

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  deleteSchool: async (req, res) => {
    try {

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateSchool: async (req, res) => {
    try {

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
}

module.exports = schoolController