# Error Handling With Express and Promises

This is an example of using generic error handling code using promises in Express-based API services to remove the need - in general - for developers to write custom error handling code for each individual service handler.

## About The Code

There are two versions of the code:

* `promise-based-server.js` - use just promises to implement this idea, Bluebird in this instance. This code will run on Node version 0.12.
* `generator-based-server.js` - uses the combination of promises and generators to enable straight-line fashion asynchronous code. This code will run on Node version 4 and 5 or up.

Both of these servers use the same global error handling middleware: `error-handler.js`. The error handler must be installed as the last middleware in your express app using `app.use()` before starting to listen.

`github-api.js` implements a couple of github API for use as "api calls" to use with this demo.

## Credit

This code took inspiration from [this article from StrongLoop](https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/).




