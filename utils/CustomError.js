module.exports = class CustomError extends Error {
  constructor(message, statusCode, errors=null) {
    super(message);
    this.code = statusCode
    this.errors = errors
  }
}
