const { promisify } = require(`util`);
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
    return next(new AppError(`Please provide email and password.`, 400));
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

exports.protect = catchAsync(async (req, res, next) => {
  // Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(`Bearer `)
  ) {
    token = req.headers.authorization.split(` `)[1];
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in! Please log in to get access.`, 401)
    );
  }
  // Token Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(`The user coresponding to this token no longer exists`, 401)
    );
  }

  // Check if user changed password after token issuing
  if (!currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password, please log in again`, 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});
