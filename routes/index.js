const {
  loadView
} = require('../utils');
const auth = require('./auth');

const index = {
  path: '/',
  method: 'GET',
  handler: function(req, reply) {
    let res = reply.response(loadView('index'));
    res.header('Content-Type', 'text/html');
    res.code(200);
    return res;
  }
};

module.exports = [
  index, ...auth
];