const { body } = require('express-validator')
// const {userSchema, User} = require("../models/User")

const validationRules = (method) => {
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
    case 'createTodo':
      return [
        body('title')
          .trim()
          .isLength({ min: 2 })
          .withMessage('Title must be at least 2 characters'),
        body('description')
          .trim()
          .isLength({ min: 5 })
          .withMessage('Password must be at least 5 characters'),
      ]
  }
}

module.exports = validationRules;

