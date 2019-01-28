const {
  logout
} = require('../utils');

const logoutConfig = {
  path: '/logout',
  method: 'GET',
  handler: logout
};

module.exports = [
  logoutConfig
]