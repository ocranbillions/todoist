const {Todo} = require('../models/Todo');

const createTodo = async (req, res) => {
  req.body.status = "pending";
  try {
    const todo = new Todo(req.body);
    const result = await todo.save();

    return res.status(201).json({
      success: true,
      data: result,
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const editTodo = async (req, res) => {
  
  try {

    return res.status(201).json({
      success: true,
      data: {},
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteTodo = async (req, res) => {
  try {

    return res.status(201).json({
      success: true,
      data: {},
    })

  }catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const fetchTodo = async (req, res) => {
  
  try {

    return res.status(201).json({
      success: true,
      data: {},
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

    return res.status(201).json({
      success: true,
      data: {},
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
  fetchAll
}