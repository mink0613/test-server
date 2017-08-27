
var database = require('./database-connection.js');

exports.getUserInfo = function(req, callback) {
	var id = req.userid;
	var passwd = req.password;
	var sqlQuery = 'SELECT * FROM users WHERE id = ' + database.mysqlEscape(id) + ' AND password = ' + database.mysqlEscape(passwd);
	
	console.log('getUserInfo Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('The result is: ', rows);
			if(rows.length > 0) {
				var userData = {
					id: rows[0].id,
					passwd: rows[0].password,
					fname: rows[0].fname,
					lname: rows[0].lname,
					email: rows[0].email
				};
				console.log("userData22: ", userData);
				return callback(null, userData);
			}
		} else {
			console.log("Error: ", err);
		}
	});
	
	return callback('getUserInfo error!!', null);
};

exports.addNewUser = function(req, callback) {
	var id = req.userid;
	var passwd = req.password;
	var fname = req.fname;
	var lname = req.lname;
	var email = req.email;
	
	var sqlQuery = 'INSERT INTO users (id, password, fname, lname, email) VALUES (' + database.mysqlEscape(id) + ', ' + database.mysqlEscape(passwd) + ', ' + database.mysqlEscape(fname) + ', ' + database.mysqlEscape(lname) + ', ' + database.mysqlEscape(email) + ')';
	
	console.log('addNewUser Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('The result is: ', rows);
			return callback(true, null);
		} else {
			console.log("Error: ", err);
		}
	});
	
	return callback('addNewUser error!!', null);
};