const http = require('http');
const app = require('./app');

const normalizePort = val => { 
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); //find a valid port in number or string format
app.set('port', port);

const errorHandler = error => { //if something doesn't work, return appropriate error
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); //import the specificities of our application

server.on('error', errorHandler); //if there is an error when we start the server, return the specific error 
server.on('listening', () => { //if everything's okay then we execute the following code
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; //we bind the port wich the server will run
  console.log('Listening on ' + bind); //we log a confirmation message with the port launched
});

server.listen(port);
