const { Todo } = require('../models/Todo');
const CustomError  = require("../utils/CustomError");
const { User } = require('../models/User');
const validate = require("../utils/validate");
const { sendQueue } = require('../utils/rabbitMQ')


module.exports.createTodo = async function({ todoInput }, req) {
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)
  
  validate("createTodo", todoInput)

  const user = await User.findOne({ email: req.user.email });
  
  if(!user) throw new CustomError("User not found!", 404)
  
  todoInput.author = user;
  todoInput.status = "pending";
  const todo = new Todo(todoInput);
  
  const createdTodo = await todo.save();
  user.todos.push(createdTodo);
  await user.save();

  return {
    ...createdTodo._doc,
    id: createdTodo._id.toString(),
    createdAt: createdTodo.createdAt.toISOString(),
    updatedAt: createdTodo.updatedAt.toISOString()
  };
}


module.exports.fetchTodo = async function({ id }, req) {
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  validate("objectID", {id})

  const user = await User.findOne({ email: req.user.email });
  
  const todo = await Todo.findById(id);

  if(!user || !todo) {
    const entity = user ? "Todo" : "User"
    throw new CustomError(`${entity} not found!`, 404)
  }

  if(todo.author.toString() !== req.user.id.toString())
    throw new CustomError("Forbidden!", 403)
    
  return {
    ...todo._doc,
    id: todo._id.toString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString()
  };
}


module.exports.fetchTodos = async function(args, req) {
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  const user = await User.findOne({ email: req.user.email });

  if(!user) throw new CustomError("User not found!", 404)

  const todos = await Todo.find({ author: user._id });
  
  const totalTodos = await Todo.find({ author: user._id }).countDocuments();
    
  return {
    totalTodos,
    todos: todos.map(todo => {
      return {
        ...todo._doc,
        id: todo._id.toString(),
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString()
      };
    })
  };
}



module.exports.updateTodo = async function({ id, todoInput }, req) {
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  validate("todoUpdate", {id, ...todoInput})

  const user = await User.findOne({ email: req.user.email });
  
  const todo = await Todo.findById(id);

  if(!user || !todo) {
    const entity = user ? "Todo" : "User"
    throw new CustomError(`${entity} not found!`, 404)
  }

  if(todo.author.toString() !== req.user.id.toString())
    throw new CustomError("Forbidden!", 403)
  
  todoInput.status.toLowerCase();

  const updatedTodo = await Todo.findOneAndUpdate({_id: id}, todoInput,
    { new: true }
  );

  return {
    ...updatedTodo._doc,
    id: updatedTodo._id.toString(),
    createdAt: updatedTodo.createdAt.toISOString(),
    updatedAt: updatedTodo.updatedAt.toISOString()
  };
}



module.exports.deleteTodo = async function({ id }, req) {
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  validate("objectID", {id})

  const user = await User.findOne({ email: req.user.email });
  
  const todo = await Todo.findById(id);

  if(!user || !todo) {
    const entity = user ? "Todo" : "User"
    throw new CustomError(`${entity} not found!`, 404)
  }

  if(todo.author.toString() !== req.user.id.toString())
    throw new CustomError("Forbidden!", 403)

  await Todo.findByIdAndRemove(id);
  user.todos.pull(id);
  await user.save();
  
  return true;
}


module.exports.inviteFriend = async function({ friendsEmail }, req){
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  validate("email", {email: friendsEmail})

  const friend = await User.findOne({ email: friendsEmail });
  
  if(!friend) throw new CustomError("User not found!", 404)
  
  const myEmail = req.user.email;
  const me = await User.findOne({ email: myEmail });

  me.invites.push(friendsEmail);
  await me.save();

  const message = {friendsEmail, ownersEmail: myEmail};
  const queue = "send_email";

  return sendQueue(message, queue).then(message => message)
}


module.exports.fetchFriendsTodos = async function({ friendsEmail }, req){
  if(!req.isAuth) throw new CustomError("Your session expired. Sign in again!", 401)

  const myEmail = req.user.email;

  const friend = await User.findOne({ email: friendsEmail });
  
  if(!friend) throw new CustomError(`The user with the email: ${friendsEmail} does not exist`, 404)
  
  const friendsInvites = Array.from(friend.invites);

  if(friendsInvites.includes(myEmail)) {
    const friendsTodos = await Todo.find({ author: friend._id });
    const totalTodos = await Todo.find({ author: friend._id }).countDocuments();

    return {
      isInvited: true,
      totalTodos,
      todos: friendsTodos.map(todo => {
        return {
          ...todo._doc,
          id: todo._id.toString(),
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString()
        };
      }),
    };
  }

  return {
    isInvited: false,
    totalTodos: 0,
    todos: []
  }
}

