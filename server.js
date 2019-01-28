const hapi = require('hapi');

const routes = require('./routes');

const server = hapi.server({
  host: 'localhost',
  port: 3000,
  state: {
    ignoreErrors: true
  }
});

const goodConsoleOptions = {
  ops: false,
  reporters: {
    console: [{
      module: 'good-console'
    }, 'stdout']
  }
};

const init = async () => {
  await server.register({
    plugin: require('good'),
    options: goodConsoleOptions
  });
  await server.route(routes);
  await server.start();
  console.log('Server is running at http://localhost:3000');
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();