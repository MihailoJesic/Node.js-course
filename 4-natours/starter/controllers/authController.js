const { promisify } = require(`util`);
const jwt = require(`jsonwebtoken`);
const User = require(`./../models/userModel`);
const AppError = require(`../utils/appError`);
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWL_EXPIRES_IN,
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    role: req.body.role,
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

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`No user coresponding to that email`, 404));
  }

  // generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password and password confirm to ${resetURL}.\nIf you didn't forget your password please ignore this email.`;

  console.log(`Data >>>> ${message}, ${user}`);

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (Valid for 10 min)`,
      message: message,
    });

    res.status(200).json({
      status: `success`,
      message: `Token sent to email`,
    });
  } catch (err) {
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;

    return next(
      new AppError(
        `There was an error sending the email, try again later.`,
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on password
  const hashedToken = crypto
    .createHash(`sha256`)
    .update(req.params.token)
    .digest(`hex`);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // Check if a user exists and if the token has expired

  console.log(
    `💙💙💙User: ${user}, hashedToken: ${hashedToken}, Token: ${req.params.token}`
  );

  if (!user) return next(new AppError(`Token is invalid or expired.`, 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.PasswordResetToken = undefined;
  user.PasswordResetExpires = undefined;
  await user.save();

  // Update changedPasswordAt
  // Log in the user

  const token = signToken(user._id);
  res.status(200).json({
    status: `success`,
    token: token,
  });
});
