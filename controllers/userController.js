const { compareSync } = require('bcryptjs');
const {User} = require('../models/User');
const generateToken = require("../utils/generateToken")

const signUp = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  req.body.created_at = new Date();
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        errors: [{message: "Email in use"}],
      })
    }

    const user = new User(req.body);
    const result = await user.save();

    const token = generateToken({email: result.email, id: result._id});

    return res.status(201).json({
      success: true,
      data: {token},
    })

  }catch(error) { next(error) }
}

const signIn = async (req, res, next) => {
  req.body.email = req.body.email.toLowerCase();
  const {email, password} = req.body;
  try {

    const existingUser = await User.findOne({ email });

    if (!existingUser || (!compareSync(password, existingUser.password))) {
      return res.status(400).json({
        success: false,
        errors: [{message: "Wrong login credentials"}],
      })
    }

    const token = generateToken({email: existingUser.email, id: existingUser._id});

    return res.status(200).json({
      success: true,
      data: {token},
    })

  }catch(error) { next(error) }
}

module.exports = {
  signUp,
  signIn
}