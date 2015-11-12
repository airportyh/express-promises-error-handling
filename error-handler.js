
// Error handler implemented as an express middleware.
module.exports = function(err, req, resp, next) {
  if (err) {
    // Setting status to 500, although we could
    // attach the status number to the error object if we wanted
    resp.status(500);
    // logs the error along with the method and path to the console
    console.warn('Server error occurred for', req.method, req.path);
    // and the stacktrace
    console.warn('  ' + err.stack);
    // we could log to a file here if we wanted to

    // output a JSON response per JSON API requirements
    resp.json({
      type: err.constructor.name,
      code: err.code,
      message: err.message || 'Unknown'
    });
  } else {
    next();
  }
}