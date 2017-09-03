var restify = require('restify');

var session = require('restify-session')({
	debug: false,
	ttl: 60
});

var fs = require('fs');
const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
 
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(session.sessionManager);

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.post('/', function(req, res) {
	
});
 
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
  var database = require('./database-access.js');
});