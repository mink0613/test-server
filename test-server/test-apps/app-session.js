var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: '12312312321ADASDAg##!231a',
	resave: false,
	saveUninitialized: true
}));

app.post('/auth/login', function(req, res) {
	var user = {
			username: 'abcd',
			password: '1234'
	};
	
	var uname = req.body.userid;
	var pwd = req.body.password;
	
	var database = require('./database-access.js');
	var data = {
			userid: uname,
			password: pwd
	};
	
	database.getUserInfo(data, function(err, userData) {
		console.log('getUserInfo is finished: ', userData);
		
		/*if(req.body.newUser != "") {
			res.redirect('/newUser');
		} else */if(userData.id == user.username && userData.passwd == user.password) {
			res.redirect('/welcome');
		} else {
			console.log('getUserInfo is finished22: ', userData);
			res.send('who are you? <a href="/auth/login">login</a>');
		}
	});
	
	//console.log('The retrieved data id is: ', result.userid);
	//console.log('The retrieved data pwd is: ', result.passwd);
});

app.get('/auth/login', function(req, res) {
	fs.readFile('./htmls/login.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.post('/auth/newUser', function(req, res) {

	var uname = req.body.userid;
	var pwd = req.body.password;
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var emailAdr = req.body.email;
	
	if(uname.length == 0 || pwd.length == 0 || firstName.length == 0 || lastName.length == 0 || emailAdr.length == 0) {
		alert('Please fill your information correctly.');
		return;
	}
	alert('Please fill your information correctly.');
	var database = require('./database-access.js');
	var data = {
			userid: uname,
			password: pwd,
			fname: firstName,
			lname: lastName,
			email: emailAdr
	};
	
	database.addNewUser(data, function(err, result) {
		console.log('getUserInfo is finished: ', result);
		if(result == true) {
			res.redirect('/welcome-new');
	});
});

app.get('/auth/newUser', function(req, res) {
	fs.readFile('./htmls/newUser.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.get('/count', function(req, res){
	if(req.session.count) {
		req.session.count++;
	} else {
		req.session.count = 1;
	}
	
	res.send('count: ' + req.session.count);
});

app.listen(3030, function() {
	console.log('Connected to 3030!!!');
});