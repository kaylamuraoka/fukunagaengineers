const Schools = require('../models/schoolModel')

const schoolController = {
  getSchools: async (req, res) => {
    try {
      const schools = await Schools.find()

      res.json(schools)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  createSchool: async (req, res) => {
    try {
      const { doe_code, name, address, city, zip_code, phone, fax, grade_from, grade_to, type, website, complex, island, charter, esis_name, principal, images, district, year_built } = req.body

      if (!images)
        return res.status(400).json({ msg: "No image upload." })

      const school = await Schools.findOne({ doe_code })

      if (school)
        return res.status(400).json({ msg: "This school already exists." })

      const newSchool = new Schools({
        doe_code, name: name.toLowerCase(), address, city, zip_code, phone, fax, grade_from, grade_to, type, website, complex, island, charter, esis_name, principal, images, district, year_built
      })

      await newSchool.save()

      res.json({ msg: "Created a school" })

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