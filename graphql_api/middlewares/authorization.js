const jwt = require('jsonwebtoken');

module.exports = isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();

  }catch(error) {
    return res.status(401).json({
      success: false,
      errors: [{message: "Please proide a valid token"}],
    })
  }
}
