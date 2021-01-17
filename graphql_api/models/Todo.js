const mongoose = require("mongoose");
const Schema = mongoose.Schema

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String, enum: ["pending", "completed"],
      required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = {
  Todo,
}
