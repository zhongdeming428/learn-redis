const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const redis = require('redis-connection')();

const viewsDir = path.resolve(__dirname, '../views/');

function loadView(name) {
  const filePath = viewsDir + '/' + name + '.html';
  const str = fs.readFileSync(filePath).toString('utf-8');
  return str;
}

function getToken() {
  const GUID = Date.now();
  const token = jwt.sign({
    auth: GUID,
  }, 'akjhfklasjdhfjkhdsa123498hjr9');
  redis.hmset(GUID, isValid, true);  // 此处还有问题～
  return token;
}

function authSuccess(req, reply) {
  const private = loadView('private');
  const token = getToken();
  return reply.response(private)
    .header('authorization', token)
    .header('Content-Type', 'text/html').code(200);
}

function authFail(req, reply) {
  return 'Password incorrect!';
}

module.exports = {
  loadView,
  authSuccess,
  authFail
};