const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
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
    validate: {
      // !IMPORTANT! Only works on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: `Passwords are not the same`,
    },
  },
});

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model(`User`, userSchema);

module.exports = User;
