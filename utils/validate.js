const validator = require('validator');
const CustomError  = require("../utils/CustomError");


module.exports = function (resolver, data){
  let errors = [];
  switch (resolver) {
    case 'signUp': 
    case 'signIn':
      if (!validator.isEmail(data.email)) {
        errors.push({ message: 'Email is invalid.' });
      }
      if (
        validator.isEmpty(data.password) ||
        !validator.isLength(data.password, { min: 5 })
      ) {
        errors.push({ message: 'Password too short!' });
      }
      if (errors.length > 0) throw new CustomError("Invalid input!", 400, errors)
      return;

    case 'createTodo':
      if (!validator.trim(data.title)) {
        errors.push({ message: 'Title can not be empty' });
      }
      if (
        validator.isEmpty(data.description) ||
        !validator.isLength(data.description, { min: 6 })
      ) {
        errors.push({ message: 'Description is too short!' });
      }
      if (errors.length > 0) throw new CustomError("Invalid input!", 400, errors)
      return;

    case 'todoUpdate':
      if(!validator.isMongoId(data.id)) {
        errors.push({ message: 'Provide a valid mongoose objectID' });
      }
      if (!validator.trim(data.title)) {
        errors.push({ message: 'Title can not be empty' });
      }
      if (
        validator.isEmpty(data.description) ||
        !validator.isLength(data.description, { min: 6 })
      ) {
        errors.push({ message: 'Description is too short!' });
      }
      if (
        data.status.toLowerCase() !== "pending" &&
        data.status.toLowerCase() !== "completed"
      ) {
        errors.push({ message: 'STATUS must either be COMPLETED or PENDING' });
      }
      if (errors.length > 0) throw new CustomError("Invalid input!", 400, errors)
      return;

    case 'objectID':
      if(!validator.isMongoId(data.id)) {
        errors.push({ message: 'Invalid mongoose ObjectID' });
      }
      if (errors.length > 0) throw new CustomError("Invalid input!", 400, errors)
  }
}
