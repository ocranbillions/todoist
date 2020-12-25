const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const cleanedErrorObjects = []
  errors.array().map(err => cleanedErrorObjects.push({ [err.param]: err.msg }))

  return res.status(400).json({
    success: false,
    errors: cleanedErrorObjects,
  })
}

module.exports = validate