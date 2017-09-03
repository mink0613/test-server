
var restify = require('restify');
var session = require('restify-session')({
	debug: true,
	ttl: 2
});
var fs = require('fs');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment = require('moment');

const app = restify.createServer({
  name: 'tw-sampleApp',
  version: '1.0.0'
});
 
app.use(restify.plugins.acceptParser(app.acceptable));
app.use(restify.plugins.queryParser());
app.use(restify.plugins.bodyParser());
app.use(session.sessionManager);

//var app = express();

//app.use(bodyParser.urlencoded({extended: false}));

/*app.use(session({
	secret: '12312312321ADASDAg##!231a',
	resave: false,
	saveUninitialized: true
}));*/

//app.set('jwtTokenSecret', '$#@!#!1231231FDSA1235!9');

app.use(function logger(req,res,next) {
	console.log(new Date(),req.method,req.url);
	//res.redirect('/auth/login', next);
	next();
});
	 
app.on('uncaughtException',function(request, response, route, error){
	console.error(error.stack);
	response.send(error);
});

app.post('/auth/login', function(req, res) {
	
	var uname = req.body.userid;
	var pwd = req.body.password;
	
	var database = require('./database-access.js');
	var data = {
			userid: uname,
			password: pwd
	};
	
	database.getUserInfo(data, function(err, userData) {
		console.log('getUserInfo is finished: ', userData);
		
		if(!err && userData.id == uname && userData.passwd == pwd) {
			
			var expires = moment().add('days', 7).valueOf();
			var token = jwt.encode({
			  iss: userData.id,
			  exp: expires
			}, app.get('jwtTokenSecret'));
			
			console.log('token: ', token);
			
			var loginSession = {
					token: token,
					userid: uname
			};
			
			database.saveLoginInfo(loginSession, function(err, uuid) {
				/*var data = {
					token: uuid	
				};
				
				database.getLoginInfo(data, function(err, result) {
					
				});*/
				
				res.json({
					message: 'login succes',
					token: token
				});
				res.redirect('/projects');
			});
			//res.send(token);
			//res.redirect('/projects');
		} else {
			res.redirect('/auth/loginFail');
			return;
		}
	});
});

app.get('/auth/loginFail', function(req, res, next) {
	fs.readFile('./htmls/loginFail.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
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

app.post('/auth/directToLogin', function(req, res) {
	res.redirect('/auth/login');
});

app.post('/auth/newUser', function(req, res) {

	var uname = req.body.userid;
	var pwd = req.body.password;
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var emailAdr = req.body.email;
	
	if(uname.length == 0 || pwd.length == 0 || firstName.length == 0 || lastName.length == 0 || emailAdr.length == 0) {
		res.send('Please enter valid user info. <a href="/auth/newUser">New User</a>');
		return;
	}
	
	// check user id if exists
	var data = {
			userid: uname,
			password: pwd
	};
	
	var database = require('./database-access.js');
	
	database.getUserInfo(data, function(err, userData) {
		console.log('getUserInfo is finished: ', userData);
		
		// if user exists
		if(!err && userData.id == uname) {
			// alert
			//alert('User already exists: ', uname);
			res.redirect('/auth/newUser');
			return;
		}
		
		var data = {
				userid: uname,
				password: pwd,
				fname: firstName,
				lname: lastName,
				email: emailAdr
		};
		
		database.addNewUser(data, function(err, result) {
			console.log('addNewUser is finished: ', result);
			if(result == true) {
				res.redirect('/auth/login');
			} else if(err && err == 'EN_DUP_ENTRY') {
				// alert
				//alert('User already exists: ', uname);
			}
			else {
				console.log('something wrong?: ', err);
				alert('Info is incorrect');
			}
		});
	});
});

app.post('/auth/updateUser', function(req, res) {

	var uname = req.body.userid;
	var pwd = req.body.password;
	var firstName = req.body.fname;
	var lastName = req.body.lname;
	var emailAdr = req.body.email;
	
	if(uname.length == 0 || pwd.length == 0 || firstName.length == 0 || lastName.length == 0 || emailAdr.length == 0) {
		res.send('Please enter valid user info. <a href="/auth/newUser">New User</a>');
		return;
	}
	
	// check user id if exists
	var data = {
			userid: uname,
			password: pwd
	};
	
	var database = require('./database-access.js');
	
	database.getUserInfo(data, function(err, userData) {
		console.log('getUserInfo is finished: ', userData);
		
		// if user exists
		if(!err && userData.id == uname) {
			// alert
			//alert('User already exists: ', uname);
			var data = {
					userid: uname,
					password: pwd,
					fname: firstName,
					lname: lastName,
					email: emailAdr
			};
			
			database.updateUser(data, function(err, result) {
				console.log('updateUser is finished: ', result);
				if(result == true) {
					res.redirect('/auth/login');
				} else if(err && err == 'EN_DUP_ENTRY') {
					// alert
					//alert('User already exists: ', uname);
				}
				else {
					console.log('something wrong?: ', err);
					alert('Info is incorrect');
				}
			});
			
			return;
		}
	});
});

app.get('/auth/updateUser', function(req, res) {
	fs.readFile('./htmls/updateUser.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.get('/auth/requestUserInfo', function(req, res) {
	
	console.log('requestUserInfo');
	
	// check user id if exists
	var data = {
			userid: 'mkwak3',
			password: 'fjtnldywjd1'
	};
	
	var database = require('./database-access.js');
	
	database.getUserInfo(data, function(err, userData) {
		if(!err && userData.id == data.userid && userData.passwd == data.password) {
			//var userInfo = '<userId>' + userData.id + '</userId>';
			//userInfo += '<password>' + userData.passwd + '</password>';
			//userInfo += '<fname>' + userData.fname + '</fname>';
			//userInfo += '<lname>' + userData.lname + '</lname>';
			//userInfo += '<email>' + userData.email + '</email>';
			var userInfo = userData.id + ',' + userData.passwd + ',' + userData.fname + ',' + userData.lname + ',' + userData.email;
			
			console.log('userInfo: ', userInfo);
			
			res.send(userInfo);
		} else {
			res.redirect('/auth/loginFail');
			return;
		}
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

app.post('/auth/directToNewUser', function(req, res) {
	res.redirect('/auth/newUser');
});

app.get('/projects', function(req, res) {
	
	console.log('token: ', req.json.token);
	
	fs.readFile('./htmls/projectList.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.get('/projects/requestProjectList', function(req, res) {
	
	console.log('requestProjectList');
	
	var database = require('./database-access.js');
	var userData = {
			userId: 'mkwak3'
	};
	
	database.getProject(userData, function(err, projects) {
		var projectList = '';
		projects.forEach(function(projects) {
			projectList += '<option id="' + projects.projectId + '" value="' + projects.projectName + '" />';
		});
		
		console.log('ProjectList: ', projectList);
		
		res.send(projectList);
	});
});

function getTaskList(projectInfo, callback) {
	var database = require('./database-access.js');
	var taskList = '';
	
	// Return value is as follows
	// taskListId:taskId,title,todo/taskId,title,todo/
	database.getTaskList(projectInfo, function(err, taskLists) {
		if(taskLists) {
			console.log('Adding task lists...');
			
			var taskListLength = taskLists.length;
			var taskListCount = 0;
			
			for(var index = 0; index < taskLists.length; index++) {
				var item = taskLists[index];
				
				var taskListData = {
						taskListId: item.taskListId
				};
				
				getTask(taskListData, function(err, tasks) {
					taskList += taskListData.taskListId + ':' + tasks + ';';
					
					taskListCount++;
					if(taskListCount == taskListLength) {
						console.log('getTaskList finished');
						callback(null, taskList);
					}
				});
			}
		} else {
			callback(null, taskList);
		}
	});
}

function getTask(taskListInfo, callback) {
	var database = require('./database-access.js');
	var tasksResults = '';
	
	database.getTask(taskListInfo, function(err, tasks) {
		console.log('Adding tasks ...');
		if(tasks) {
			tasks.forEach(function(tasks) {
				var task = tasks.taskId + ',' + tasks.title + ',' + tasks.todo + '/';
				tasksResults += task;
			});
			
			console.log('getTask: ', tasksResults);
		} 
		
		callback(null, tasksResults);
	});
}

app.post('/projects/requestTaskList', function(req, res) {
	
	console.log('/projects/requestTaskList, POST: ');
	var projectInfo = {
			projectId: 1
	};
	
	var database = require('./database-access.js');
	
	database.createNewTaskList(projectInfo, function(err, projects) {
		res.redirect('/projects/requestTaskList'); // self redirect to refresh the task list
	});
});

app.get('/projects/requestTaskList', function(req, res) {
	
	console.log('login id: ', req.session.user_id);
	
	var projectInfo = {
			projectId: 1
	};
	
	getTaskList(projectInfo, function(err, results) {
		if(!err) {
			res.send(results);
		}
	});
});

app.post('/projects/create', function(req, res) {
	
	var projectName = req.body.projectName;
	
	var database = require('./database-access.js');
	
	var data = {
		title: projectName,
		userId: 'mkwak3'
	};
	
	database.createNewProject(data, function(err, result) {
		if(!err && result == true) {
			var data = {
					userId: 'mkwak3'
			};
			
			database.getProject(data, function(err, results) {
				console.log('getProject: ', err);
				console.log(results);
			});
		}
	});
});

app.get('/projects/create', function(req, res) {
	fs.readFile('./htmls/projectCreate.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.get('/projects/project', function(req, res) {
	fs.readFile('./htmls/project.html', function(error, data) {
		if(error) {
			console.log(error);
		} else {
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.end(data);
		}
	});
});

app.post('/projects/selectProject', function(req, res){
	res.redirect('/project/selectedProject');
});

app.post('/projects/directToCreate', function(req, res){
	res.redirect('/projects/create');
});

app.post('/projects/directToUpdateUserInfo', function(req, res){
	res.redirect('/auth/updateUser');
});

app.post('/projects/directToLogout', function(req, res){
	res.redirect('/auth/login');
});

app.listen(3030, function() {
	console.log('Connected to 3030!!!');
});