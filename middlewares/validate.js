const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const fieldsWithErrors = []
  errors.array().map(err => fieldsWithErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
    errors: fieldsWithErrors,
  })
}

module.exports = validate