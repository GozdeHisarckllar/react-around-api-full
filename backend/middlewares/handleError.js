const handleError = (err, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error has occurred on the server'
        : message,
    });
};

module.exports = handleError;
