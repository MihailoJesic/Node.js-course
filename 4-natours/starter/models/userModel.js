const mongoose = require(`mongoose`);
const validator = require(`validator`);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Valid email required`],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm password'],
  },
});

const User = mongoose.model(`User`, userSchema);

module.exports = User;
