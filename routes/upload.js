const router = require('express').Router()
const uploadImage = require('../middleware/uploadImage')
const uploadController = require('../controllers/uploadController')
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

router.post('/upload_avatar', uploadImage, auth, uploadController.uploadAvatar)

// Only admin can upload image with this route
router.post('/upload_image', uploadImage, auth, authAdmin, uploadController.uploadImage)

// Only admin can delete image with this route
router.post('/delete_image', auth, authAdmin, uploadController.deleteImage)

module.exports = router