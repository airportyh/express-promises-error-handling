"use strict"

const express = require('express');
const bluebird = require('bluebird');
const github = require('./github-api');
const errorHandler = require('./error-handler');
const error = require('./http-errors');
const app = express();

// Like the promise-based version, this uses an `api`
// wrapper to let us write controllers in a "new and enhanced"
// style. This one uses generators, which allows us to
// finally write straight-line Node code despite having to
// do asychronous IO.
app.get('/', api(function *(req, resp) {
  let gistId = req.query.gistId;
  if (!gistId) {
    throw new error.BadRequest('Gist ID required');
  }
  // Have a promise? Just yield it to get its underlying value
  let gist = yield github.getGist(gistId);

  if (gist.owner.login === 'airportyh') {
    throw new error.Unauthorized('Unauthorized user ' + gist.owner.login);
  }
  // You yield as many times as you want!
  let user = yield github.getUser(gist.owner.login);
  let repos = yield github.getRepos(user.login);
  // just return the object you want to render as JSON response
  return repos;
}));

// Implementation of the api wrapper function for
// generators. This one uses bluebird to turn a generator
// function into a function that returns a promise.
//
// This wrapper automatically handles errors as well as
// rendering the resulting value of the promise as a JSON
// response.
function api (genFn) {
  let cr = bluebird.coroutine(genFn);
  return function (req, resp, next) {
    return cr(req, resp, next)
      .then(function(value) {
        resp.json(value);
      })
      .catch(next);
  };
}

app.use(errorHandler);

app.listen(3000);
console.log('listening on 3000');