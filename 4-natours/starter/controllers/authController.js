const jwt = require(`jsonwebtoken`);
const User = require(`./../models/userModel`);
const AppError = require(`../utils/appError`);
const catchAsync = require('../utils/catchAsync');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWL_EXPIRES_IN,
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: `success`,
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and passworld.`, 400));
  }
  // Check if user and password are correct
  const user = await User.findOne({ email }).select(`+password`);

  // If there is no user the OR will short circuit the call for an undefined property
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password.`, 401));
  }

  // If everything is ok send web token
  const token = signToken(user._id);
  res.status(200).json({
    status: `success`,
    token: token,
  });
});
