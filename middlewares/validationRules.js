const { body, check, checkSchema } = require('express-validator')
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
          .isLength({ min: 5 })
          .withMessage('Title must be at least 5 characters'),
        body('description')
          .trim()
          .isLength({ min: 10 })
          .withMessage('description must be at least 10 characters'),
      ]
    case 'editTodo':
      const Schema = {
        "status": {
          in: 'body',
          matches: {
            options: [/\b(?:canceled|completed|pending)\b/],
            errorMessage: "status must be 'canceled', 'deleted', OR 'pending'"
          }
        }
      }
      return [
        body('title')
          .optional()
          .trim()
          .isLength({ min: 5 })
          .withMessage('Title must be at least 5 characters'),
        body('description')
          .optional()
          .trim()
          .isLength({ min: 10 })
          .withMessage('description must be at least 10 characters'),
        checkSchema(Schema),
        
      ]
    case 'inviteFriend':
      return [
        body('email')
          .isEmail()
          .withMessage('Email must be valid')
      ]
  }
}

module.exports = validationRules;

