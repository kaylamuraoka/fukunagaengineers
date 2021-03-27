import React, { useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import { isValidPassword, isMatch } from '../../utils/validation/Validation'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

const initialState = {
  name: '',
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

function Profile() {
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)

  const { user, isAdmin } = auth
  const [data, setData] = useState(initialState)
  const [avatar, setAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [callback, setCallback] = useState(false)

  const { name, password, cf_password, err, success } = data

  return (
    <div className="profile_page">
      <div className="col-left">
        <h2>{isAdmin ? 'Admin Profile' : 'User Profile'}</h2>

        <div className="avatar">
          <img src={avatar ? avatar : user.avatar} alt="profile" />
          <span>
            <i className="fas fa-camera"></i>
            <p>Change</p>
            <input type="file" name="file" id="file_up" />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" defaultValue={user.name} placeholder="Your name" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" defaultValue={user.email} placeholder="Your email address" disabled />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" id="phone" defaultValue={user.phone} placeholder="Your phone number" disabled />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input type="password" name="password" id="password" placeholder="Your password" value={password} />
        </div>

        <div className="form-group">
          <label htmlFor="cf_password">Confirm New Password</label>
          <input type="password" name="cf_password" id="cf_password" placeholder="Confirm password" value={cf_password} />
        </div>

        <button disabled={loading}>Update</button>
      </div>

      <div className="col-right">
        <h2>{isAdmin ? "Users" : "MyOrders"}</h2>

        <div style={{ overflowX: "auto" }}>
          <table className="customers">
            <thead>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Admin</th>
              <th>Action</th>
            </thead>
            <tbody>
              <th>ID</th>
              <td>Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Admin</td>
              <td>Action</td>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Profile
