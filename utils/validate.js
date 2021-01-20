const validator = require('validator');
const CustomError  = require("../utils/CustomError");


module.exports = function (resolver, data){

  switch (resolver) {
    case 'signUp': 
    case 'signIn':
      const errors = [];
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
    // case 'createTodo':

  }
}


