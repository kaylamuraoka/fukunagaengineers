import React, { useState } from 'react'
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { showErrMsg, showSuccessMsg } from "../../utils/notification/Notification"
import { dispatchLogin } from "../../../redux/actions/authAction"
import { useDispatch } from "react-redux"
import { GoogleLogin } from 'react-google-login';

const initialState = {
  email: '',
  password: '',
  err: '',
  success: ""
}

function Login() {
  const [user, setUser] = useState(initialState)
  const dispatch = useDispatch()
  const history = useHistory()

  const { email, password, err, success } = user

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value, err: '', success: '' })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post('/user/login', { email, password })
      setUser({ ...user, err: "", success: res.data.msg })

      localStorage.setItem('firstLogin', true)

      dispatch(dispatchLogin())
      history.push("/")

    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" })
    }
  }

  const handleGoogleLogin = async (response) => {
    try {

      const res = await axios.post('/user/google_login', {
        tokenId: response.tokenId
      })

      setUser({ ...user, err: '', success: res.data.msg })
      localStorage.setItem('firstLogin', true)

      dispatch(dispatchLogin())
      history.push("/")
    } catch (err) {
      (err.response.data.msg && err.response.data.msg !== 'The verifyIdToken method requires an ID Token') &&
        setUser({ ...user, err: err.response.data.msg, success: '' })
    }
  }

  return (
    <div className="login_page">
      <h2>Login</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input type="text" placeholder="Enter email address" id="email" value={email} name="email" onChange={handleChangeInput} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Enter password" id="password" value={password} name="password" onChange={handleChangeInput} />
        </div>

        <div className="row">
          <button type="submit">Login</button>
          <Link to="/forgot_password">Forgot your password?</Link>
        </div>

      </form>

      <div className="hr">Signed up with Google?</div>

      <div className="social">
        <GoogleLogin
          clientId="998673085002-9pcvhkm6umtj4ephltodmt3u24180a6k.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={'single_host_origin'}
        />
      </div>

      <p>Don't have an account yet? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login
