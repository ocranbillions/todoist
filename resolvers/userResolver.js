const { compareSync } = require('bcryptjs');
const { User } = require('../models/User');
const generateToken = require("../utils/generateToken")
const CustomError  = require("../utils/CustomError");
const validate = require("../utils/validate")

module.exports.signUp = async ({ userData }, req) => {
  userData.email = userData.email.toLowerCase();
  const {email, password} = userData;

  validate("signUp", userData)
  
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new CustomError("Email in use!", 409)

  const user = new User(userData);
  const result = await user.save();

  const token = generateToken({email, id: result._id});

  return {token};
}

module.exports.signIn = async ({ userData }, req) => {
  userData.email = userData.email.toLowerCase();
  const {email, password} = userData;

  validate("signIn", userData)

  const user = await User.findOne({ email });

  if (!user || (!compareSync(password, user.password))) 
    throw new CustomError("Wrong login credentials", 401)

  const token = generateToken({email, id: user._id});

  return {token};
}
