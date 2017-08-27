var mysql = require('mysql');
var dbconfig = require('./database-config.js');
var connection = mysql.createPool(dbconfig);

exports.executeQuery = function(query, callback) {
	execute(query, function(err, rows) {
	     if (!err) {
	        callback(null, rows);
	     }
	     else {
	        callback(true, err);
	     }
   });
};

function execute(query, callback) {
	connection.getConnection(function(err, connect) {
		if(err) {
			return callback(err, null);
		} else if(connect) {
			connect.query(query, function(err, rows, fields) {
				connect.release();
				if(err) {
					return callback(err, null);
				}
				
				return callback(null, rows);
			});
		} else {
			return callback("No connection", null);
		}
	});
}

exports.getDBName = function() {
	return dbconfig.getDBName();
};

exports.mysqlEscape = function(param) {
	return mysql.escape(param);
};

exports.createConnection = function() {
	return connection;
};




