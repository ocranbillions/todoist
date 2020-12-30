const { Todo } = require('../models/Todo');
const { User } = require('../models/User');
const { promisify } = require('util')
const { sendQueue } = require('../utils/rabbitMQ')
const awakeWorkerService = require("../utils/awakeWorkerService")

const createTodo = async (req, res) => {
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

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const editTodo = async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;
  
  try {

    const user = await User.findOne({ email: req.user.email });
    const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    if(!todoBelongsToUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const todo = await Todo.findOneAndUpdate({_id: id}, {
      [title]: title, // update field if present
      [description]: description,
      status: status.toLowerCase()
    },
     { new: true }
    );

    return res.status(200).json({
      success: true,
      data: todo,
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const deleteTodo = async (req, res) => {
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

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const fetchTodo = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: todo,
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const fetchAll = async (req, res) => {
  try {

    const email =  req.user.email;
    const user = await User.findOne({ email });
    const todos = await Todo.find({ author: user._id });


    return res.status(200).json({
      success: true,
      data: todos,
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const inviteFriend = async (req, res) => {
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

    if(process.env.NODE_ENV === "development") {
      await awakeWorkerService()
    }
    sendQueue(message, queue)
      .then((msg) => {
        return res.status(200).json({
          success: true,
          message: msg,
        })
      })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const fetchFriendsTodos = async (req, res) => {
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

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
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