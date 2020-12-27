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
      type: String, enum: ["pending", "completed", "canceled"],
      required: true
    },
    created_at: {
      type: Date,
      required: true,
    },
    author: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = {
  Todo,
}
