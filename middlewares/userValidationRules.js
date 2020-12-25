const { body } = require('express-validator')
// const {userSchema, User} = require("../models/User")

const userValidationRules = (method) => {
  switch (method) {
    case 'signup': 
    case 'signin':
      return [
        body('email')
          .isEmail()
          .withMessage('Email must be valid'),
          // .custom(val => userSchema.statics.findByEmail(val)),
        body('password')
          .trim()
          .isLength({ min: 4, max: 20 })
          .withMessage('Password must be between 4 and 20 characters'),
      ]
  }
}

module.exports = userValidationRules;

