const { Todo } = require('../models/Todo');
// const { User } = require('../models/User');

module.exports = {
  createTodo: async function({ todoInput }, res) {
    todoInput.status = "pending";

    // const user = await User.findOne({ email: req.user.email });
    // todoInput.author = user;

    const todo = new Todo(todoInput);
    
    // user.todos.push(todo);
    await todo.save();
    // await user.save();

    return {
      ...todo._doc,
      id: todo._id.toString(),
      // createdAt: todo.createdAt.toISOString(),
      // updatedAt: todo.updatedAt.toISOString()
    };
  },
  fetchTodo: async function({ id }, req) {
    const todo = await Todo.findById({ _id: id });
      
      return {
        ...todo._doc,
        id: todo._id.toString(),
      };
  },
  fetchTodos: async function(args, req) {

    // const email =  req.user.email;
    // const user = await User.findOne({ email });
    // const todos = await Todo.find({ author: user._id });
    const todos = await Todo.find();
    const totalTodos = await Todo.find().countDocuments();
      
    return {
      todos: todos.map(todo => {
        return {
          ...todo._doc,
          id: todo._id.toString(),
        };
      }),
      totalTodos
    };
  },
  updateTodo: async function({ id, todoInput }, req) {
    // const user = await User.findOne({ email: req.user.email });
    // const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    // if(!todoBelongsToUser) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized"
    //   })
    // }
    
  
    const fields = {}
    for(field in todoInput) {
      fields[field] = todoInput[field]
    }
    fields.status = todoInput.status.toLowerCase();

    const updatedTodo = await Todo.findOneAndUpdate({_id: id}, fields,
     { new: true }
    );

    return {
      ...updatedTodo._doc,
      id: updatedTodo._id.toString(),
    };
  },
  deleteTodo: async function({ id }, req) {
    // const user = await User.findOne({ email: req.user.email });

    // const todoBelongsToUser = user.todos.find(todoId => todoId.toString() === id)

    // if(!todoBelongsToUser) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized"
    //   })
    // }

    await Todo.findByIdAndRemove(id);
    // user.todos.pull(id);
    // await user.save();
    return true;
  }
}

