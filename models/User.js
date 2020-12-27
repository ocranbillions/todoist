const mongoose = require("mongoose");
const Schema = mongoose.Schema
const { hashSync } = require('bcryptjs');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
    invites: [{ type: String }]
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const pwdHash = hashSync(this.password, 10);
    this.set('password', pwdHash);
  }
  done();
});

// userSchema.statics.findByEmail = function (email) {
//   return this.find({ email: email })
//           .then(result => {
//             if (result) throw new Error('Email already exist!')
//         })
// }

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  userSchema,
}
