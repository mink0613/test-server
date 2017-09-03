var mysql = require('mysql');
var dbconfig = require('./database-config.js');
var connection = mysql.createConnection(dbconfig);
//var dbConn = connection.getConnection();
connection.connect();

async function executeQuery(queryStr) {
	
	return new Promise(function(resolve, reject) {
		connection.query(queryStr, function(err, results, fields) {
			//dbConn.release();
			if(err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
		
		//connection.end();
	});
}

exports.getDBName = function() {
	return dbconfig.getDBName();
};

exports.executeQuery = executeQuery;

exports.mysqlEscape = function(param) {
	return mysql.escape(param);
};

exports.createConnection = function() {
	return connection;
};




