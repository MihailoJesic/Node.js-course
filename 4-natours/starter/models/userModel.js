const crypto = require(`crypto`);
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
  role: {
    type: String,
    enum: [`user`, `guide`, `lead-guide`, `admin`],
    default: `user`,
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: 8,
    select: false,
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // false means no change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString(`hex`);

  this.passwordResetToken = crypto
    .createHash(`sha256`)
    .update(resetToken)
    .digest(`hex`);

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = +Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model(`User`, userSchema);

module.exports = User;
