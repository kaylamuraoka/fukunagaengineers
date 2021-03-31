const router = require('express').Router()
const schoolController = require('../controllers/schoolController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get("/schools", schoolController.getSchools)

router.post("/schools", auth, authAdmin, schoolController.createSchool)

router.delete("/schools/:id", auth, authAdmin, schoolController.deleteSchool)

router.put("/schools/:id", auth, authAdmin, schoolController.updateSchool)

module.exports = router