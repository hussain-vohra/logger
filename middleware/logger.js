const morgan = require("morgan");
const logger = require("../logger");

const stream = {
  write: (message) => logger.info(message.trim()),
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);

// const morganMiddleware = morgan(
//   ':method :url :status :res[content-length] - :response-time ms',
//   {
//     stream: {
//       // Configure Morgan to use our custom logger with the http severity
//       write: (message) => logger.http(message.trim()),
//     },
//   }
// );

module.exports = morganMiddleware;
