const {
  loadView
} = require('../utils');
const auth = require('./auth');
const logout = require('./logout');
const validate = require('./validate');

const index = {
  path: '/',
  method: 'GET',
  config: {
    auth: false
  },
  handler: function(req, reply) {
    let res = reply.response(loadView('index'));
    res.header('Content-Type', 'text/html');
    res.code(200);
    return res;
  }
};

module.exports = [
  index, ...auth, ...logout, ...validate
];