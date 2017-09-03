'use strict';

var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
var jwtConfig = require('./config');
var database = require('../../database-access');
var SECRET = jwtConfig.jwtSecret;
var EXPIRES = jwtConfig.expire; 

//set jwt token
async function signToken(id, callback) {
	var token = jwt.sign({id: id}, SECRET, { expiresIn: EXPIRES });
	
	var loginData = {
			userId: id,
			token: token
	};
	
	var result = await database.saveLoginInfo(loginData);
	if(!result) {
		return null;
	}
	console.log(token);
	return token;
}

// check whether user is authenticated or not
async function isAuthenticated(token, callback) {
	if(!token) {
		return null;
	}
	
	var userData = {
			token: token
	};
	
	//console.log('auth token: ', token);
	//console.log('auth userData: ', userData);
	var result = await database.checkLoginInfo(userData);
	console.log('auth userId: ', result);
	
	if(!result) {
		return null;
	}
	
	var decoded = jwt.verify(token, SECRET);
	if(decoded.id != result) {
		return null;
	}
	return decoded.id;
}

exports.signToken = signToken;
exports.isAuthenticated = isAuthenticated;