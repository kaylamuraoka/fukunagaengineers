const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(400)
        .json({ msg: "No authentication token, authorization denied." });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({ msg: "Token verification failed, authorization denied." })

      req.user = user
      next()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
