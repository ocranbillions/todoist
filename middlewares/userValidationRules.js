const { body } = require('express-validator')

const userValidationRules = (method) => {
  switch (method) {
    case 'signup': 
    case 'signin':
      return [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
          .trim()
          .isLength({ min: 4, max: 20 })
          .withMessage('Password must be between 4 and 20 characters'),
      ]
  }
}

module.exports = userValidationRules;

