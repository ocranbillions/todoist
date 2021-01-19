const { Todo } = require('../models/Todo');
const { User } = require('../models/User');
const { promisify } = require('util')
const { sendQueue } = require('../utils/rabbitMQ')

const createTodo = async (req, res, next) => {
  req.body.status = "pending";
  req.body.created_at = new Date();
  try {
    const todo = new Todo(req.body);

    const user = await User.findOne({ email: req.user.email });

    todo.author = user._id;
    user.todos.push(todo);
    const record = await todo.save();
    await user.save();

    return res.status(201).json({
      success: true,
      data: record
    })

  }catch(error) { next(error) }
}


const editTodo = async (req, res, next) => {
  const id = req.params.id;
  const {  status } = req.body;
  
  try {

    const user = await User.findOne({ email: req.user.email });
    const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    if(!todoBelongsToUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const fields = {}
    for(field in req.body) {
      fields[field] = req.body[field]
    }
    fields.status = status.toLowerCase();

    const todo = await Todo.findOneAndUpdate({_id: id}, fields,
     { new: true }
    );

    return res.status(200).json({
      success: true,
      data: todo,
      fields
    })

  }catch(error) { next(error) }
}


const deleteTodo = async (req, res, next) => {
  const id = req.params.id;
  try {

    const user = await User.findOne({ email: req.user.email });

    const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    if(!todoBelongsToUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const deleteTodo = promisify(Todo.findByIdAndDelete).bind(Todo)

    await deleteTodo(id)

    return res.status(200).json({
      success: true,
      message: `Todo ID: ${id} has been deleted`,
    })

  }catch(error) { next(error) }
}

const fetchTodo = async (req, res, next) => {
  const id = req.params.id
  try {

    const user = await User.findOne({ email: req.user.email });

    const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    if(!todoBelongsToUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }
    
    const todo = await Todo.findOne({ _id: id });

    return res.status(todo ? 200 : 404).json({
      success: todo ? true : false,
      data: todo,
    })

  }catch(error) { next(error) }
}


const fetchAll = async (req, res, next) => {
  try {

    const email =  req.user.email;
    const user = await User.findOne({ email });
    const todos = await Todo.find({ author: user._id });


    return res.status(200).json({
      success: true,
      data: todos,
    })

  }catch(error) { next(error) }
}


const inviteFriend = async (req, res, next) => {
  try {
    const friendsEmail = req.body.email;

    const friend = await User.findOne({ email: friendsEmail });
    if(!friend) {
      return res.status(404).json({
        success: false,
        data: "user not found"
      })
    }

    const myEmail = req.user.email;
    const me = await User.findOne({ email: myEmail });
    me.invites.push(friendsEmail);
    await me.save();

    const message = {friendsEmail, ownersEmail: myEmail};
    const queue = "send_email";

    sendQueue(message, queue)
      .then((msg) => {
        return res.status(200).json({
          success: true,
          message: msg,
        })
      })

  }catch(error) { next(error) }
}


const fetchFriendsTodos = async (req, res, next) => {
  const friendsEmail = req.params.email;
  const myEmail = req.user.email;
  try{
    const friend = await User.findOne({ email: friendsEmail });
  
    if(!friend) {
      return res.status(404).json({
        success: false,
        message: `The user with the email: ${friendsEmail} does not exist`,
      })
    }
    
    const friendsInvites = Array.from(friend.invites);
    if(friendsInvites.includes(myEmail)) {
      const friendsTodos = await Todo.find({ author: friend._id });

      return res.status(200).json({
        success: true,
        data: friendsTodos,
      })
    }
    
    return res.status(401).json({
      success: false,
      message: `You have not been invited to view ${friendsEmail}'s todos`,
    })

  }catch(error) { next(error) }
}

module.exports = {
  createTodo,
  editTodo,
  deleteTodo,
  fetchTodo,
  fetchAll,
  inviteFriend,
  fetchFriendsTodos
}