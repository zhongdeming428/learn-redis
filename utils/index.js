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

async function getToken() {
  const GUID = Date.now();
  const token = jwt.sign({
    auth: GUID,
  }, 'akjhfklasjdhfjkhdsa123498hjr9');
  console.log(`GUID: ${GUID}`);
  await redis.hset(GUID, 'isValid', true);
  return token;
}

async function authSuccess(req, reply) {
  const private = loadView('private');
  const token = await getToken();
  console.log(token);
  return reply.response(private)
    .header('authorization', token)
    .header('Content-Type', 'text/html').code(200);
}

function authFail(req, reply) {
  return 'Password incorrect!';
}

function logout(req, reply) {
  let token = req.headers.authorization; // 现在 headers 并没有传过来 authorization，这里要改进。
  return token;
}

module.exports = {
  loadView,
  authSuccess,
  authFail,
  logout
};