const app = require('./app');
const socketClusterServer = require('socketcluster-server');
const http = require('http');

const port = process.env.PORT || 3500;
let options = {
  wsEngine: 'ws',
  // ...
};

let httpServer = http.createServer();
let agServer = socketClusterServer.attach(httpServer, options);

const server = app();
server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`> Ready on localhost:${port}`);
});

module.exports = server;
httpServer.listen(8000);
