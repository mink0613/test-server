
var database = require('./database-connection.js');

exports.createDB = function() {
	
	var sqlQuery = 'CREATE DATABASE IF NOT EXIST tw-database'; //+ database.getDBName();
	console.log('createDB Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('database is created');
		} else {
			console.log("createDB Error: ", err);
		}
	});
};

exports.createTableUser = function() {
	
	var sqlQuery = 'CREATE TABLE users (id varchar(255) NOT NULL, password varchar(255) NOT NULL, fname varchar(40) NOT NULL, lname varchar(40) NOT NULL, email varchar(255) NOT NULL, PRIMARY KEY(id))';
	console.log('createTableUser Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('createTableUser is created');
		} else {
			console.log("createTableUser Error: ", err);
		}
	});
};

exports.createTableProject = function() {
	
	var sqlQuery = 'CREATE TABLE project (id INT NOT NULL AUTO_INCREMENT, projectName varchar(255) NOT NULL, userId varchar(255) NOT NULL)';
	console.log('createTableProject Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('createTableUser is created');
		} else {
			console.log("createTableProject Error: ", err);
		}
	});
};

exports.createTableTaskList = function() {
	
	var sqlQuery = 'CREATE TABLE taskList (taskListid INT NOT NULL AUTO_INCREMENT, projectId INT NOT NULL';
	console.log('createTableTaskList Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('createTableTaskList is created');
		} else {
			console.log("createTableTaskList Error: ", err);
		}
	});
};

exports.createTableTask = function() {
	
	var sqlQuery = 'CREATE TABLE task (taskId INT NOT NULL AUTO_INCREMENT, taskListId INT NOT NULL';
	console.log('createTableTask Query is: ', sqlQuery);
	
	database.executeQuery(sqlQuery, function(err, rows) {
		if(!err) {
			console.log('createTableTask is created');
		} else {
			console.log("createTableTask Error: ", err);
		}
	});
};