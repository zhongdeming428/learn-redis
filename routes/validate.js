const jwt = require('jsonwebtoken');
const redis = require('redis-connection')();
const { expires } = require('../config').JWT;

module.exports = [
  {
    path: '/validate',
    method: 'GET',
    config: {
      auth: false
    },
    handler(req, reply) {
      let token = req.query.token;
      let decoded = jwt.decode(token);
      let { auth, iat } = decoded;
      if (iat * 1000 + expires <= Date.now()) {
        return false;
      }
      return new Promise(resolve => {
        redis.get(`GUID:${auth}`, (err, res) => {
          if (err) resolve(err);
          else {
            console.log(res);
            if (res) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        });
      });
    }
  }
];