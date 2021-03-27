import React, { useState } from 'react'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { isEmail } from '../../utils/validation/Validation'

const initialState = {
  email: '',
  err: '',
  success: ''
}

const ForgotPassword = () => {
  const [data, setData] = useState(initialState)

  const { email, err, success } = data

  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const forgotPassword = async () => {
    if (!isEmail(email))
      return setData({ ...data, err: 'Please enter a valid email address.', success: '' })

    try {
      const res = await axios.post('/user/forgot', { email })
      return setData({ ...data, err: '', success: res.data.msg })

    } catch (err) {
      err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  return (
    <div className="fg_pass">
      <h2>Forgot Your Password</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="email">Enter your email address</label>
        <input type="email" name="email" id="email" value={email} onChange={handleChangeInput} className={
          !isEmail(data.email) || (data.err === "No account with this email exists in our system.")
            ? "invalid-input"
            : "valid-input"
        } />
        {!isEmail(data.email) || (data.err === "No account with this email exists in our system.") ? (
          <p className="invalid-feedback">Please enter a valid email address.</p>
        ) : (
            null
          )}
        <button onClick={forgotPassword}>Reset your password</button>
      </div>
    </div>
  )
}

export default ForgotPassword
