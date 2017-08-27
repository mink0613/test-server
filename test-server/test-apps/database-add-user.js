
var database = require('./database-connection.js');

var connection = database.createConnection();
var sqlQuery = "INSERT INTO users (id, password, fname, lname, email) VALUES ('jle', '1234', 'john', 'lenon', 'jle@gmail.com')";
connection.query(sqlQuery, function(err, rows, field) {
	if(!err) {
		console.log('The result is: ', rows);
	} else {
		console.log("Error: ", err);
	}
});

connection.end();