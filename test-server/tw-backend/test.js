var restify = require('restify');
 
const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});
 
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

function createUser() {
	// do something
}

function login(id, password) {
	connection.connect();
	connection.query('SELECT userid, password from users WHERE userid =' + id, function(err, rows) {
		if(err) throw err;
		
		console.log('The result is: ', rows);
		if(rows[0].password == password) {
			return true;
		}
		return false;
	});
	
	connection.release();
	connection.close();
}

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  port     : 3000,
  database : 'my_db'
});

// crypt
const crypto = require('crypto');

const cipher = crypto.createCipher('aes-256-cbc', 'key');
let result = cipher.update('sentences', 'utf8', 'base64');
result += cipher.final('base64');

const decipher = crypto.createDecipher('aes-256-cbc', 'key');
let result2 = decipher.update(result, 'base64', 'utf8'); 
result2 += decipher.final('utf8'); 

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});
 
server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});