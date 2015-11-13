"use strict"

var express = require('express');
var errorHandler = require('./error-handler');
var github = require('./github-api');
var util = require('util');
var error = require('./http-errors');
var app = express();

// Note the api wrapper used, it allows our service handler
// to simply return a promise, and takes care of error handling
// as well as rendering the resulting object as a JSON response.
app.get('/', api(function(req, resp) {
  // this handler simply hits the Github API for a gist
  // then hits the API again for info on the owner of the gist
  // it returns a promise, whose value - when it resolves - will
  // be rendered as a JSON response. It demonstrates throwing
  // custom errors as well.
  var gistId = req.query.gistId; // get gistID from query param
  if (!gistId) {
    throw new error.BadRequest("Gist ID required");
  }
  return github.getGist(gistId)
    .then(function(gist) {
      if (gist.owner.login === 'airportyh') {
        // We just don't like Toby
        throw new error.Unauthorized('Unauthorized user ' + gist.owner.login);
      }
      return github.getUser(gist.owner.login);
    });
}));

// Implementation of the api wrapper
// Although we technically could do without a wrapper
// like this, and instead modify express itself to
// work with our "new style controllers" - which is the 
// approach taken by https://github.com/jas/express-promisify.
// I discourage this approach precisely because it modifies
// the behavior of express itself, which could have bad
// long term consequences. I think having to wrap your 
// handlers with a function call is a small price to pay
// vs the potential cost.
//
// This wrapper automatically handles errors as well as
// rendering the resulting value of the promise as a JSON
// response.
function api(fn) {
  return function(req, resp, next) {
    var promise = fn(req, resp, next);
    promise
      .then(function(value) {
        resp.json(value);
      }).catch(function(err) {
        next(err);
      });
  };
}

app.use(errorHandler);

app.listen(3000);
console.log('listening on 3000');