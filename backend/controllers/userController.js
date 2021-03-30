const Users = require("./../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendMail = require("./sendMail")

const { google } = require('googleapis')
const { OAuth2 } = google.auth
const fetch = require('node-fetch')

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const CLIENT_URL = process.env.CLIENT_URL

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body

      if (!name || !email || !phone || !password)
        return res.status(400).json({ msg: "Please fill in all fields." })

      if (!validateName(name))
        return res.status(400).json({ msg: "Please enter a valid name." })

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Please enter a valid email address." })

      if (!validatePhone(phone))
        return res.status(400).json({ msg: "Please enter a valid phone number." })


      const user = await Users.findOne({ email })
      if (user)
        return res.status(400).json({ msg: "An account with this email address already exists. Try login." })

      const phoneExists = await Users.findOne({ phone })
      if (phoneExists)
        return res.status(400).json({ msg: "An account with this phone number already exists. Please enter your mobile phone number." })

      if (!validatePassword(password))
        return res.status(400).json({ msg: "Password must be at least six characters long." })

      const passwordHash = await bcrypt.hash(password, 12)

      const newUser = {
        name, email, phone, password: passwordHash
      }

      const activation_token = createActivationToken(newUser)

      const url = `${CLIENT_URL}/user/activate/${activation_token}`

      sendMail(email, url, "Verify your email address")

      console.log({ activation_token })

      res.json({ msg: "Your account has been created successfully! Please check your email for a verification link to activate your account." })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

      const { name, email, phone, password } = user

      const check = await Users.findOne({ email })
      if (check) return res.status(400).json({ msg: "An account with this email address already exists. Try login." })

      const newUser = new Users({
        name, email, phone, password
      })

      await newUser.save()

      res.json({ msg: "Account has been activated!" })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }

  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await Users.findOne({ email })

      if (!user)
        return res.status(400).json({ msg: "No account with this email exists in our system." })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." })

      const refresh_token = createRefreshToken({ id: user._id })
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.json({ msg: "Login success!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken

      if (!rf_token)
        return res.status(400).json({ msg: "Please login now!" })

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please login now!" })

        const access_token = createAccessToken({ id: user.id })
        res.json({ access_token })
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      const user = await Users.findOne({ email })
      if (!user)
        return res.status(400).json({ msg: "No account with this email exists in our system." })

      const access_token = createAccessToken({ id: user._id })
      const url = `${CLIENT_URL}/user/reset/${access_token}`

      sendMail(email, url, "Reset your password")

      res.json({
        msg: `Password Reset Email Sent. An email hasbeen sent to your email address, ${email}. Follow the directions in the email to reset your password.`
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body
      console.log(password)

      if (!validatePassword(password))
        return res.status(400).json({ msg: "Password must be at least six characters long." })

      const passwordHash = await bcrypt.hash(password, 12)

      console.log(req.user)
      await Users.findOneAndUpdate({ _id: req.user.id }, {
        password: passwordHash
      })

      res.json({ msg: "Password successfully changed!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password")

      res.json(user)
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getAllUsersInfo: async (req, res) => {
    try {
      console.log(req.user)
      const users = await Users.find().select("-password")

      res.json(users)

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  logout: async (req, res) => {

    try {
      res.clearCookie('refreshtoken', { path: '/usesr/refresh_token' })
      return res.json({ msg: "Logged out successfully." })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name, phone, avatar } = req.body
      await Users.findOneAndUpdate({ _id: req.user.id }, {
        name, phone, avatar
      })

      res.json({ msg: "Update success!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body

      await Users.findOneAndUpdate({ _id: req.params.id }, {
        role
      })

      res.json({ msg: "Update success!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id)

      res.json({ msg: "User has been deleted successfully!" })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID
      })

      console.log(verify)
      const { email } = verify.payload

      const password = email + process.env.GOOGLE_SECRET

      const passwordHash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ email })
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
          return res.status(400).json({ msg: 'Password is incorrect.' })

        const refresh_token = createRefreshToken({ id: user._id })
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json({ msg: "Login success!" })
      } else {
        return res.status(400).json({ msg: "Please create an account first before you may login with Google." })
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  googleRegister: async (req, res) => {
    try {
      const { tokenId } = req.body

      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID
      })

      console.log(verify)
      const { email_verified, email, name, picture } = verify.payload

      const password = email + process.env.GOOGLE_SECRET

      const passwordHash = await bcrypt.hash(password, 12)

      if (!email_verified)
        return res.status(400).json({ msg: 'Email verification failed.' })

      const user = await Users.findOne({ email })
      if (user) {
        return res.status(400).json({ msg: "An account with this email address already exists. Try login." })
      } else {
        const phone = req.body.phone

        if (!validatePhone(phone))
          return res.status(400).json({ msg: "Please enter a valid phone number." })

        const phoneExists = await Users.findOne({ phone })
        if (phoneExists)
          return res.status(400).json({ msg: "An account with this phone number already exists. Please enter your mobile phone number." })

        const newUser = new Users({
          name, email, phone: phone, password: passwordHash, avatar: picture
        })

        await newUser.save()
        res.json({ msg: "Your account has been created successfully! Please login with your Google account." })
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body

      const URL = ` "https://graph.facebook.com/v2.9/${userID}/fields=id,name,email,picture"?access_token=${accessToken}`

      const data = await fetch(URL).then(res => res.json()).then(res => { return res })

      console.log(data)
      const { email, name, picture } = data

      const password = email + process.env.FACEBOOK_SECRET

      const passwordHash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ email })

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
          return res.status(400).json({ msg: 'Password is incorrect.' })

        const refresh_token = createRefreshToken({ id: user._id })
        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: '/user/refresh_token',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json({ msg: "Login success!" })
      } else {
        return res.status(400).json({ msg: "Please create an account first before you may login with Facebook." })
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  facebookRegister: async (req, res) => {
    try {
      const { accessToken, userID } = req.body

      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

      const data = await fetch(URL)
        .then(res => res.json())
        .then(res => {
          return res
        })

      console.log(data)

      const { email, name, picture } = data

      const password = email + process.env.FACEBOOK_SECRET

      const passwordHash = await bcrypt.hash(password, 12)

      const user = await Users.findOne({ email })
      if (user) {
        return res.status(400).json({ msg: "An account with this email address already exists. Try login." })
      } else {
        const phone = req.body.phone

        if (!validatePhone(phone))
          return res.status(400).json({ msg: "Please enter a valid phone number." })

        const phoneExists = await Users.findOne({ phone })
        if (phoneExists)
          return res.status(400).json({ msg: "An account with this phone number already exists. Please enter your mobile phone number." })

        const newUser = new Users({
          name, email, phone: phone, password: passwordHash, avatar: picture.data.url
        })

        await newUser.save()
        res.json({ msg: "Your account has been created successfully! Please login with your Facebook account." })
      }

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateName(name) {
  if (name.length < 2 || !name.match(/^[A-Za-z- ]+$/)) {
    return false
  }
  return true
}

function validatePhone(phone) {
  if (phone.length !== 10 || !phone.match(/^\d{10}$/)) {
    return false
  }
  return true
}

function validatePassword(password) {
  if (password.length < 6) {
    return false;
  }
  return true;
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '24hr' })
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController
