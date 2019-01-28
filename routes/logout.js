const {
  logout
} = require('../utils');

const logoutConfig = {
  path: '/logout',
  method: 'GET',
  config: {
    auth: false
  },
  handler: logout
};

module.exports = [
  logoutConfig
]