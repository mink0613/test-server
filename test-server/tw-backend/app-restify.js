'use strict';

// dependencies
var restify = require('restify'),
    session = require('restify-session')({
        debug : true,
        ttl   : 2
    });

//var request = require('request-promise');
var user = require('./api/model/user');
var database = require('./database-access');
var jwt = require('jsonwebtoken');
var auth = require('./api/auth/user-auth');

// create the server
const server = restify.createServer({
	  name: 'tw-sampleApp',
	  version: '1.0.0'
	});

// attach the session manager
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(session.sessionManager);

server.use(function logger(req,res,next) {
	console.log(new Date(),req.method,req.url);
	next();
});

async function userLogin(req, res, next) {
	var loginUser = user.check(req.body.userId, req.body.password);
	
	console.log('111');
	var result = await database.getUserInfo(loginUser);
	if(result instanceof String) {
		console.log('222');
		res.json({ 
			message: 'logged in failed1', success: false
        });
	} else {
		console.log('333');
		var token = await auth.signToken(loginUser.userId);
		console.log('444');
		if(!token) {
			res.json({ 
				message: 'logged in failed2', success: false
	        });
		} else {
			console.log('555');
			res.json({ 
				message: 'logged in successfully', info: token
	        });
		}
	}
	
	next();
}

async function userLogout(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	// TODO: change to await - async XXX
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		var userData = {
				userId: result
		};
		
		var result = await database.removeLoginInfo(userData);
		
		if(result == false) {
			res.json({ 
				message: 'Logged out failed', success: false
	        });
		} else {
			res.json({ 
				message: 'Logged out successfully', success: true
	        });
		}
	}
	
	next();
}

async function userCreate(req, res, next) {
	var newUser = user.create(req.body.userId, req.body.password, req.body.fname, req.body.lname, req.body.email);
	
	var result = await database.addNewUser(newUser);
	
	if(result == false) {
		res.json({ 
			message: 'user created failed', success: false
        });
	} else {
		res.json({ 
			message: 'user created successfully', success: true
        });
	}
	
	next();
}

async function userUpdate(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	// TODO: change to await - async XXX
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		var userData = {
				userId: req.body.userId,
				password: req.body.password,
				fname: req.body.fname,
				lname: req.body.lname,
				email: req.body.email
		};
		
		var result = await database.updateUser(userData);
		
		if(!result) {
			res.json({ 
				message: 'user updated failed', success: false
	        });
		} else {
			res.json({ 
				message: 'user updated successfully', success: true
	        });
		}
	}
	
	next();
}

async function getProjects(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		var userInfo = {
				userId: result
		};
		
		var result = await database.getProjects(userInfo);
		if(!result) {
			res.json({ 
				message: 'user updated failed', success: false
	        });
		} else {
			res.json({ 
				message: 'project list retrieved successfully', projectList: result
	        });
		}
	}
	
	next();
}

async function getProject(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		var userInfo = {
				projectId: req.body.projectId,
				userId: result
		};
		
		// get project
		var resultProject = await database.getProjectById(userInfo);
		if(!resultProject) {
			res.json({ 
				message: 'get project failed', success: false
	        });
		} else {
			
			// get task list
			var taskListInfo = {
					projectId: userInfo.projectId
			}
			
			var resultTaskLists = await database.getTaskLists(taskListInfo);
			var taskLists = [];
			
			for(var index = 0; index < resultTaskLists.length; index++) {
				var taskInfo = {
						taskListId: resultTaskLists[index].taskListId
				};
				
				var resultTasks = await database.getTasks(taskInfo);
				
				var tasks = [];
				for(var index2 = 0; index2 < resultTasks.length; index2++) {
					tasks.push(resultTasks[index2]);
				}
				
				var taskList = {
						taskListId: resultTaskLists[index].taskListId,
						projectId: resultTaskLists[index].projectId,
						taskListName: resultTaskLists[index].taskListName,
						tasks: tasks
				};
				
				taskLists.push(taskList);
			}
			
			var projectStructure = {
					projectId: resultProject.projectId,
					projectName: resultProject.projectName,
					userId: resultProject.userId,
					taskLists: taskLists
			};
			
			res.json({ 
				message: 'get project retrieved successfully', info: projectStructure
	        });
		}
	}
	
	next();
}

async function projectCreate(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
        return;
    }
	
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		// TODO: need to use model XXX
		var projectInfo = {
				title: req.body.title,
				userId: result
		};
		
		console.log('create project: ', projectInfo);
		
		var result = await database.createNewProject(projectInfo);
		
		if(!result) {
			res.json({ 
				message: 'create project failed', success: false
	        });
		} else {
			var result = await database.getProjectByName(projectInfo);
			if(!result) {
				res.json({ 
					message: 'create project failed', success: result
		        });
			} else {
				var taskLists = [];
				var project = {
						projectId: result.projectId,
						title: projectInfo.title,
						userId: projectInfo.userId,
						taskLists: taskLists
				};
				
				res.json({ 
					message: 'project created successfully', 
					project: project
		        });
			}
		}
	}
	
	next();
}

async function createTaskList(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	var result = await auth.isAuthenticated(token);
	
	if(!result) {
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		// TODO: need to use model XXX
		var taskListInfo = {
				title: req.body.title,
				projectId: req.body.projectId,
				userId: result
		};
		
		var result = await database.createNewTaskList(taskListInfo);
		if(!result) {
			
		} else {
			var result = await database.getTaskListByTitle(taskListInfo);
			if(!result) {
				res.json({ 
					message: 'create task list failed', success: false
		        });
			} else {
				var tasks = [];
				var taskList = {
						taskListId: result.taskListId,
						title: result.title,
						userId: result.userId,
						projectId: result.projectId,
						tasks: tasks
				};
				
				res.json({ 
					message: 'task list created successfully', 
					taskList: taskList
		        });
			}
		}
	}
	
	next();
}

async function createTask(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	console.log('7777');
	var result = await auth.isAuthenticated(token);
	if(!result) {
		console.log('8888', result);
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		// TODO: need to use model XXX
		var taskInfo = {
				title: req.body.title,
				todo: req.body.todo,
				taskListId: req.body.taskListId,
				userId: result
		};
		
		console.log('6666', result);
		var result = await database.createNewTask(taskInfo);
		if(!result) {
			console.log('0000', result);
			res.json({ 
				message: 'create task failed', success: false
	        });
		} else {
			
			console.log('1111');
			var task = await database.getTaskByName(taskInfo);
			if(!task) {
				res.json({ 
					message: 'create task failed', success: false
		        });
			} else {
				console.log('2222 ', task);
				var taskListInfo = {
						taskListId: task.taskListId
				};
				console.log('555 ', taskListInfo);
				var taskList = await database.getTaskListById(taskListInfo);
				if(!taskList) {
					console.log('3333 ', taskList);
					res.json({ 
						message: 'create task failed', success: false
			        });
				} else {
					
					var taskInfo = {
							title: task.title,
							userId: task.userId,
							projectId: taskList.projectId,
							taskListId: task.taskListId,
							title: task.title,
							todo: task.todo,
							order: task.orderInList
					};
					
					res.json({ 
						message: 'task created successfully', info: taskInfo
			        });
				}
			}
		}
	}
	
	console.log('4444 ');
	next();
}

async function switchTask(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	console.log('7777');
	var result = await auth.isAuthenticated(token);
	if(!result) {
		console.log('8888', result);
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		// TODO: need to use model XXX
		var taskInfo = {
				taskListId: req.body.taskListId,
				taskId: req.body.taskId,
				switchOrder: req.body.switchOrder,
				userId: result
		};
		
		console.log('taskInfo: ', taskInfo);
		var result = await database.switchTaskWithinList(taskInfo);
		if(!result) {
			console.log('0000', result);
			res.json({ 
				message: 'switch task failed', success: false
	        });
		} else {
			
			console.log('1111');
			var task = await database.getTaskById(taskInfo);
			if(!task) {
				res.json({ 
					message: 'switch task failed', success: false
		        });
			} else {
				console.log('2222 ', task);
				var taskListInfo = {
						taskListId: task.taskListId
				};
				console.log('555 ', taskListInfo);
				var taskList = await database.getTaskListById(taskListInfo);
				if(!taskList) {
					console.log('3333 ', taskList);
					res.json({ 
						message: 'switch task failed', success: false
			        });
				} else {
					
					// TODO: need to use model XXX
					var taskInfo = {
							title: task.title,
							userId: task.userId,
							projectId: taskList.projectId,
							taskListId: task.taskListId,
							title: task.title,
							todo: task.todo,
							order: task.orderInList
					};
					
					res.json({ 
						message: 'task created successfully', info: taskInfo
			        });
				}
			}
		}
	}
	
	console.log('4444 ');
	next();
}

async function moveTask(req, res, next) {
	
	const token = req.headers['x-access-token'] || req.query.token;
	console.log('Token: ', token);
	if(!token) {
        res.status(403).json({
            success: false,
            message: 'not logged in'
        });
        next();
    }
	
	console.log('7777');
	var result = await auth.isAuthenticated(token);
	if(!result) {
		console.log('8888', result);
		res.json({ 
			message: 'Authentication failed', success: false
        });
	} else {
		// TODO: need to use model XXX
		var taskInfo = {
				taskListId: req.body.taskListId,
				moveToTaskListId: req.body.moveToTaskListId,
				taskId: req.body.taskId,
				userId: result
		};
		
		console.log('taskInfo: ', taskInfo);
		var result = await database.moveTaskToOtherList(taskInfo);
		if(!result) {
			console.log('0000', result);
			res.json({ 
				message: 'move task failed', success: false
	        });
		} else {
			
			console.log('1111');
			var task = await database.getTaskById(taskInfo);
			if(!task) {
				res.json({ 
					message: 'move task failed', success: false
		        });
			} else {
				console.log('2222 ', task);
				var taskListInfo = {
						taskListId: task.taskListId
				};
				console.log('555 ', taskListInfo);
				var taskList = await database.getTaskListById(taskListInfo);
				if(!taskList) {
					console.log('3333 ', taskList);
					res.json({ 
						message: 'move task failed', success: false
			        });
				} else {
					
					// TODO: need to use model XXX
					var taskInfo = {
							title: task.title,
							userId: task.userId,
							projectId: taskList.projectId,
							taskListId: task.taskListId,
							title: task.title,
							todo: task.todo,
							order: task.orderInList
					};
					
					res.json({ 
						message: 'task moved successfully', info: taskInfo
			        });
				}
			}
		}
	}
	
	console.log('4444 ');
	next();
}

server.post('/login', userLogin);
server.post('/logout', userLogout);
server.post('/createUser', userCreate);
server.post('/updateUser', userUpdate);
server.post('/projects/project/list', getProjects);
server.post('/projects/project', getProject);
server.post('/projects/create', projectCreate);
server.post('/projects/project/createTaskList', createTaskList);
server.post('/projects/project/taskList/createTask', createTask);
server.post('/projects/project/taskList/switchTaskWithinList', switchTask);
server.post('/projects/project/taskList/moveTaskToOtherList', moveTask);

// attach a route
server.get('/', function(req, res, next){
   res.send({ success: true, session: req.session });
   return next();
});

server.get('/hello', function(req, res, next){
	res.send(req.session);
	return next();
});

// start the server
server.listen(3000);