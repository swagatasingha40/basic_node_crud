const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case 400:
      res.json({
        title: constants.VALIDATION_ERROR,
        message: err.message,
        stacktrace: err.stack,
      });
      break;

    case 404:
      res.json({
        title: constants.NOT_FOUND,
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case 403:
      res.json({
        title: constants.FORBIDDEN,
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case 401:
      res.json({
        title: constants.UNAUTHORIZED,
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case 500:
      res.json({
        title: constants.SERVER_ERROR,
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    default:
      console.log("No error!");
      break;
  }
};

module.exports = { errorHandler };
