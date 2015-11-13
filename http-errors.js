var util = require('util');

// This demonstrates how to write your custom error types
function Unauthorized(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = message || this.constructor.name;
  this.statusCode = 401;
}
util.inherits(Unauthorized, Error);
exports.Unauthorized = Unauthorized;

function BadRequest(message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = message || this.constructor.name;
  this.statusCode = 400;
}
util.inherits(BadRequest, Error);
exports.BadRequest = BadRequest;