import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { isValidPassword, isMatch } from '../../utils/validation/Validation'

const initialState = {
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

const ResetPassword = () => {
  const [data, setData] = useState(initialState)
  const { token } = useParams()

  const { password, cf_password, err, success } = data

  const handleChangeInput = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const handleResetPassword = async () => {
    if (!isValidPassword(password))
      return setData({ ...data, err: "Password must be at least six characters long.", success: '' })

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Passwords do not match.", success: '' })

    try {
      const res = await axios.post('/user/reset', { password }, {
        headers: { Authorization: token }
      })

      return setData({ ...data, err: '', success: res.data.msg })
    } catch (err) {
      err.response.data.msg && setData({ ...data, err: err.response.data.msg, success: '' })
    }

  }

  return (
    <div className="fg_pass">
      <h2>Reset Your Password</h2>

      <div className="row">
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={handleChangeInput} className={
          !isValidPassword(data.password)
            ? "invalid-input"
            : "valid-input"
        } />
        {!isValidPassword(data.password) ? (<p className="invalid-feedback">Password must be at least six characters long.</p>) : (null)}

        <label htmlFor="cf_password">Confirm Password</label>
        <input type="password" name="cf_password" id="cf_password" value={cf_password} onChange={handleChangeInput} className={
          !isMatch(data.password, data.cf_password)
            ? "invalid-input"
            : "valid-input"
        } />
        {!isMatch(data.password, data.cf_password) ? (<p className="invalid-feedback">Passwords do not match.</p>) : (<p className="valid-feedback">Passwords match.</p>)}

        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div >
  )
}

export default ResetPassword
