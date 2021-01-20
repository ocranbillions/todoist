const jwt = require('jsonwebtoken');

module.exports = auth = (req, res, next) => {
  const token = req.headers.authorization

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.isAuth = true;
    return next();

  }catch(error) {
    req.user = null;
    req.isAuth = false;
    next();
  }
}
