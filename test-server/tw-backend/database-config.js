var databaseName = 'tw_database';

exports.getDBName = function() {
	
	var name = databaseName;
	return name;
};

module.exports = {
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'kwak123!!',
	database: databaseName
};