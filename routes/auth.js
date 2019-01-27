const {
  loadView,
  authSuccess,
  authFail
} = require('../utils');
const redis = require('redis-connection')();
redis.setnx('admin', 'hidden');

const authGet = {
  path: '/auth',
  method: 'GET',
  handler(req, reply) {
    return loadView('auth');
  }
}

const authPost = {
  path: '/auth',
  method: 'POST',
  handler(req, reply) {
    if (req.payload.username !== 'admin') {
      return reply.response('Username is invalid!');
    } else {
      return new Promise((resolve, reject) => {
        redis.get('admin', (err, psw) => {
          if (err) return reply.response().code(500);
          else {
            if (psw === req.payload.password) {
              resolve(authSuccess(req, reply));
            } else {
              resolve(authFail(req, reply));
            }
          }
        });
      })
    }
  }
}

module.exports = [
  authGet, authPost
];