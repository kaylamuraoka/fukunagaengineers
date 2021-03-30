const router = require('express').Router()
const userController = require("../controllers/userController");
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

router.post("/register", userController.register)

router.post('/activation', userController.activateEmail)

router.post("/login", userController.login)

router.post('/refresh_token', userController.getAccessToken)

router.post("/forgot", userController.forgotPassword)

router.post("/reset", auth, userController.resetPassword)

router.get("/info", auth, userController.getUserInfo)

router.get("/all_info", auth, authAdmin, userController.getAllUsersInfo)

router.get("/logout", userController.logout)

router.patch('/update', auth, userController.updateUser)

router.patch('/update_role/:id', auth, authAdmin, userController.updateUsersRole)

router.delete('/delete/:id', auth, authAdmin, userController.deleteUser)

// Social Login
router.post("/google_login", userController.googleLogin)

router.post("/google_register", userController.googleRegister)


module.exports = router 