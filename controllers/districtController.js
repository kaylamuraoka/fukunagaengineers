const District = require('../models/districtModel')

const districtController = {
  getDistricts: async (req, res) => {
    try {
      const districts = await District.find()
      res.json(districts)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
    res.json('District test ctrl')
  },
  createDistrict: async (req, res) => {
    try {
      // if user has role = 1 --> admin
      // only admin can create, delete, and update
      const { name } = req.body
      const district = await District.findOne({ name })
      if (district)
        return res.status(400).json({ msg: 'This district already exists.' })

      const newDistrict = new District({ name })

      await newDistrict.save()

      res.json({ msg: "Created a district successfully." })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  deleteDistrict: async (req, res) => {
    try {
      await District.findByIdAndDelete(req.params.id)
      res.json({ msg: 'Deleted district successfully.' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateDistrict: async (req, res) => {
    try {
      const { name } = req.body
      await District.findByIdAndUpdate({ _id: req.params.id }, { name })

      res.json({ msg: 'Updated district successfully.' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

module.exports = districtController