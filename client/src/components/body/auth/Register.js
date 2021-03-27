import React, { useState } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"
import { showErrMsg, showSuccessMsg } from "./../../utils/notification/Notification"
import { isEmpty, isEmail, isName, isPhone, isValidPassword, isMatch } from "../../utils/validation/Validation"

const initialState = {
  name: '',
  email: '',
  phone: '',
  password: '',
  cf_password: '',
  err: '',
  success: ""
}


function Register() {
  const [user, setUser] = useState(initialState)

  const { name, email, phone, password, cf_password, err, success } = user

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value, err: '', success: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (isEmpty(name) || isEmpty(password) || isEmpty(cf_password))
      return setUser({ ...user, err: "Please fill in all fields.", success: '' })

    if (!isName(name))
      return setUser({ ...user, err: "Please enter a valid name.", success: '' })

    if (!isEmail(email))
      return setUser({ ...user, err: "Please enter a valid email address.", success: '' })

    if (!isPhone(phone))
      return setUser({ ...user, err: "Please enter a valid phone number.", success: '' })

    if (!isValidPassword(password))
      return setUser({ ...user, err: "Password must be at least six characters long.", success: '' })

    if (!isMatch(password, cf_password))
      return setUser({ ...user, err: "Passwords do not match.", success: '' })

    try {

      const res = await axios.post('/user/register', {
        name, email, phone, password
      })

      setUser({ ...user, err: '', success: res.data.msg })

    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" })
    }
  }

  return (
    <div className="login_page">
      <h2>Register</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder="Enter your name" id="name" value={name} name="name" onChange={handleChangeInput} className={
            !isName(user.name)
              ? "invalid-input"
              : "valid-input"
          } />
          {!isName(user.name) ? (<p className="invalid-feedback">Please enter a valid name.</p>) : (null)}
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input type="email" placeholder="Enter email address" id="email" value={email} name="email" onChange={handleChangeInput} className={
            !isEmail(user.email) || (user.err === "An account with this email address already exists. Try login.")
              ? "invalid-input"
              : "valid-input"
          } />
          {!isEmail(user.email) ? (<p className="invalid-feedback">Please enter a valid email address.</p>) : (null)}
        </div>

        <div>
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" placeholder="Enter phone number" id="phone" value={phone} name="phone" onChange={handleChangeInput} className={
            !isPhone(user.phone) || (user.err === "An account with this phone number already exists. Please enter your mobile phone number.")
              ? "invalid-input"
              : "valid-input"
          } />
          {!isPhone(user.phone) ? (<p className="invalid-feedback">Please enter a valid phone number.</p>) : (null)}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" value={password} name="password" onChange={handleChangeInput} className={
            !isValidPassword(user.password)
              ? "invalid-input"
              : "valid-input"
          } />
          {!isValidPassword(user.password) ? (<p className="invalid-feedback">Password must be at least six characters long.</p>) : (null)}
        </div>

        <div>
          <label htmlFor="cf_password">Confirm Password</label>
          <input type="password" placeholder="Confirm password" id="cf_password" value={cf_password} name="cf_password" onChange={handleChangeInput} className={
            !isMatch(user.password, user.cf_password)
              ? "invalid-input"
              : "valid-input"
          } />
          {!isMatch(user.password, user.cf_password) ? (<p className="invalid-feedback">Passwords do not match.</p>) : (<p className="valid-feedback">Passwords match.</p>)}
        </div>

        <div className="row">
          <button type="submit">Register</button>
        </div>

      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default Register
