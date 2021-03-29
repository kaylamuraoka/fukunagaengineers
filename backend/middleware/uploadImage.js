const fs = require('fs')

module.exports = async function (req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were uploaded." })

    const file = req.files.file

    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath)
      return res.status(400).json({ msg: "The file that you are trying to upload exceeds the 1 MB size limit. Please select a file less than 1 MB." })
    } // 1mb

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      removeTmp(file.tempFilePath)
      return res.status(400).json({ msg: "Invalid File format. You may only upload JPG, JPEG, PNG files." })
    } // 1mb

    next()
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}

const removeTmp = (path) => {
  fs.unlink(path, err => {
    if (err) throw err
  })
}