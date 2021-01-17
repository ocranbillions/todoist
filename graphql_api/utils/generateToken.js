const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '1day' },
  );
  return token;
};

module.exports = generateToken;