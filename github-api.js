// Using request-promise which has mostly the same
// API as request, but returns promises. It uses
// Bluebird internally.
const request = require('request-promise');

// returns a promise that resolves to a gist by id
exports.getGist = function getGist(id) {
  return request(
    'https://api.github.com/gists/' + id, 
    { headers: { 'User-Agent': 'express' } })
    .then(function(str) {
      return JSON.parse(str);
    });
};

// return a promise that resolves to a user by login name
exports.getUser = function getUser(id) {
  return request(
    'https://api.github.com/users/' + id,
    { headers: { 'User-Agent': 'express' } })
  .then(function(str) {
    return JSON.parse(str);
  });
};