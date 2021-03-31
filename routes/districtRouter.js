const router = require('express').Router()
const districtController = require('../controllers/districtController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get("/district", districtController.getDistricts)

router.post("/district", auth, authAdmin, districtController.createDistrict)

router.delete("/district/:id", auth, authAdmin, districtController.deleteDistrict)

router.put("/district/:id", auth, authAdmin, districtController.updateDistrict)

module.exports = router