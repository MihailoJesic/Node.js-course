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
    sendErrorProd(err, res);
  }
};
