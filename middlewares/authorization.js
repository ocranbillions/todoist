const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();

  }catch(error) {

    return res.status(400).json({
      success: false,
      errors: [{message: "Please proide a valid token"}],
    })
    
  }
}

module.exports = isLoggedIn;