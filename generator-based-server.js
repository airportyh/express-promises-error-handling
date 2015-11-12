"use strict"

const express = require('express');
const bluebird = require('bluebird');
const github = require('./github-api');
const errorHandler = require('./error-handler');
const app = express();

// Like the promise-based version, this uses an `api`
// wrapper to let us write controllers in a "new and enhanced"
// style. This one uses generators, which allows us to
// finally write straight-line Node code despite having to
// do asychronous IO.
app.get('/', api(function *(req, resp) {
  // Have a promise? Just yield it to get its underlying value
  let gist = yield github.getGist('d45749d6ecd657520e9d');
  // You can do it again!
  let user = yield github.getUser(gist.owner.login);
  // just return the object you want to render as JSON response
  return user;
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