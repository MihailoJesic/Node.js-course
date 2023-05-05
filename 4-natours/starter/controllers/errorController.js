const AppError = require(`./../utils/appError`);

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use another value`;

  return new AppError(message, 400);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperattional) {
    // Operational error, send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Program or Unknown error, don't leak error details
    console.error(`❌${err}❌`);

    // Genetic message
    res.status(500).json({
      status: `error`,
      message: `Something went wrong.`,
    });
  }
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || `error`;

  if (process.env.NOD_ENV === `development`) {
    sendErrorDev(err, res);
  } else if (process.env.NOD_ENV === `production`) {
    let error = [...err];

    if (error.name === `CaseError`) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
