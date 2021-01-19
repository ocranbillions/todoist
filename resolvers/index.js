const userResolver = require("./userResolver");
const todoResolver = require("./todoResolver");

module.exports = {
  ...userResolver,
  ...todoResolver
}