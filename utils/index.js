const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const redis = require('redis-connection')();
const { JWTSecret, expires } = require('../config').JWT;

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
  }, JWTSecret);
  console.log(`GUID: ${GUID}`);
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

async function validate(decoded, request) {
  const { auth, iat } = decoded;
  console.log(`The auth of the token to be validate is =>>> ${auth}`);
  const fail = {
    isValid: false
  }, success = {
    isValid: true
  };
  if (!auth) return fail;
  else {
    // console.log(expires + iat >= Date.now());
    if (expires + iat >= Date.now()) return fail;  // token is expired~ 
    else {
      // check whether the token is in redis blacklist~
      // redis.get with await will always return true,wrapped with promise~
      const token = await new Promise((resolve, reject) => {
        redis.get(`GUID:${auth}`, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
      // console.log(token);
      if (token) return fail;
    }
  }
  return success;
}

module.exports = {
  loadView,
  authSuccess,
  authFail,
  logout,
  validate
};