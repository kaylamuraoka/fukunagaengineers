import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom'
import { isValidPassword, isMatch } from '../../utils/validation/Validation'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { dispatchGetAllUsers, fetchAllUsers } from '../../../redux/actions/usersActions'

const initialState = {
  name: '',
  phone: '',
  password: '',
  cf_password: '',
  err: '',
  success: ''
}

function Profile() {
  const auth = useSelector(state => state.auth)
  const token = useSelector(state => state.token)

  const users = useSelector(state => state.users)

  const { user, isAdmin } = auth
  const [data, setData] = useState(initialState)
  const { name, phone, password, cf_password, err, success } = data

  const [avatar, setAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [callback, setCallback] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setData({ ...data, [name]: value, err: '', success: '' })
  }

  const dispatch = useDispatch()
  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then(res => {
        dispatch(dispatchGetAllUsers(res))
      })
    }
  }, [token, isAdmin, dispatch, callback])

  const changeAvatar = async (e) => {
    e.preventDefault()
    try {
      const file = e.target.files[0]

      if (!file)
        return setData({ ...data, err: "No files were uploaded.", success: '' })

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "The file that you are trying to upload exceeds the 1 MB size limit. Please select a file less than 1 MB.", success: '' })

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return setData({ ...data, err: "Invalid File format. You may only upload JPG, JPEG, PNG files.", success: '' })

      let formData = new FormData()
      formData.append('file', file)

      setLoading(true)
      const res = await axios.post('/api/upload_avatar', formData, {
        headers: {
          'content-type': 'multipart/form-data', Authorization: token
        }
      })

      setLoading(false)
      setAvatar(res.data.url)

    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }

  }

  const updateInfo = () => {
    try {
      axios.patch('/user/update', {
        name: name ? name : user.name,
        phone: phone ? phone : user.phone,
        avatar: avatar ? avatar : user.avatar,
      }, {
        headers: { Authorization: token }
      })

      setData({ ...data, err: '', success: 'Profile Updated Successfully!' })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const updatePassword = () => {
    if (!isValidPassword(password))
      return setData({ ...data, err: "Password must be at least six characters long.", success: '' })

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Passwords do not match.", success: '' })

    try {
      axios.post('/user/reset', { password }, {
        headers: { Authorization: token }
      })

      setData({ ...data, err: '', success: 'Password Updated Successfully!' })
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  const handleUpdate = () => {
    if (name || phone || avatar) updateInfo()
    if (password) updatePassword()
  }

  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (window.confirm("Are you sure you want to delete this account?")) {
          setLoading(true)
          await axios.delete(`/user/delete/${id}`, {
            headers: { Authorization: token }
          })
          setLoading(false)
          setCallback(!callback)
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: '' })
    }
  }

  return (
    <>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      {loading && <h3>Loading......</h3>}
      <div className="profile_page">
        <div className="col-left">
          <h2>{isAdmin ? 'Admin Profile' : 'User Profile'}</h2>

          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="profile" />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_upload" onChange={changeAvatar} />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" defaultValue={user.name} placeholder="Your name" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" defaultValue={user.email} placeholder="Your email address" disabled />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" pattern="[0-9]{3}[0-9]{3}[0-9]{4}" name="phone" id="phone" defaultValue={user.phone} placeholder="Your phone number" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input type="password" name="password" id="password" placeholder="Your password" value={password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirm New Password</label>
            <input type="password" name="cf_password" id="cf_password" placeholder="Confirm password" value={cf_password} onChange={handleChange} />
          </div>

          <div>
            <em style={{ color: 'crimson' }}>
              * If you update your password here, you will not be able to login quickly using google and facebook.
          </em>
          </div>

          <button disabled={loading} onClick={handleUpdate}>Update</button>
        </div>

        <div className="col-right">
          <h2>{isAdmin ? "Users" : "My Orders"}</h2>

          <div style={{ overflowX: "auto" }}>
            <table className="users">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map(user => (
                    <tr key={user._id} scope="row">
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        {
                          user.role === 1
                            ? <i className="fas fa-check" title="Admin"></i>
                            : <i className="fas fa-times" title="User"></i>
                        }
                      </td>
                      <td>
                        <Link to={`/edit_user/${user._id}`}>
                          <i className="fas fa-edit" title="Edit"></i>
                        </Link>
                        <i className="fas fa-trash-alt" title="Remove" onClick={() => handleDelete(user._id)}></i>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
