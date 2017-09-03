
var database = require('./database-connection.js');

async function getUserInfo(req) {
	
	var id = req.userId;
	var passwd = req.password;
	var sqlQuery = 'SELECT * FROM users WHERE id = ' + database.mysqlEscape(id);
	
	console.log('getUserInfo Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(result == null) {
		return 'database has error';
	}
	
	if(result.length > 0) {
		if(passwd == result[0].password) {
			var userData = ({
				id: result[0].id,
				passwd: result[0].password,
				fname: result[0].fname,
				lname: result[0].lname,
				email: result[0].email
			});
			
			return userData;
		}
	}
	
	return 'error';
};

async function saveLoginInfo(req) {
	var id = req.userId;
	var token = req.token;
	
	var sqlQuery = 'INSERT INTO loginInfo (token, userId) VALUES (' + database.mysqlEscape(token) + ', ' + database.mysqlEscape(id) + ')';
	
	console.log('saveLoginInfo Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		console.log('saveLoginInfo false: ', result);
		return false;
	}
	console.log('saveLoginInfo true');
	return true;
};

async function removeLoginInfo(req) {
	var userId = req.userId;
	
	var sqlQuery = 'DELETE FROM loginInfo WHERE userId=' + database.mysqlEscape(userId);
	
	console.log('removeLoginInfo Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		return false;
	}
	return true;
};

/*
 * check whether the user is currently logged in or not.
 * Return value: 
 * 0: currently logged in
 * 1: currently logged out
 * 2: Unknown error.
 */
async function checkLoginInfo(req) {
	var token = req.token;
	
	var sqlQuery = 'SELECT * FROM loginInfo WHERE token=' + database.mysqlEscape(token);
	
	console.log('checkLoginInfo Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery)
	if(!result || result.length != 1) {
		return null;
	}
	return result[0].userId;
};

async function addNewUser(req) {
	var id = req.userId;
	var passwd = req.password;
	var fname = req.fname;
	var lname = req.lname;
	var email = req.email;
	
	var sqlQuery = 'INSERT INTO users (id, password, fname, lname, email) VALUES (' + database.mysqlEscape(id) + ', ' + database.mysqlEscape(passwd) + ', ' + database.mysqlEscape(fname) + ', ' + database.mysqlEscape(lname) + ', ' + database.mysqlEscape(email) + ')';
	
	console.log('addNewUser Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		return false;
	}
	return true;
};

async function updateUser(req) {
	var id = req.userId;
	var passwd = req.password;
	var fname = req.fname;
	var lname = req.lname;
	var email = req.email;
	
	var sqlQuery = 'UPDATE users SET password=' + database.mysqlEscape(passwd) + ', fname=' + database.mysqlEscape(fname) + ', lname=' + database.mysqlEscape(lname) + ', email=' + database.mysqlEscape(email) + ' WHERE id=' + database.mysqlEscape(id);
	
	console.log('updateUser Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		return false;
	}
	return true;
};

async function createNewProject(req) {
	var title = req.title;
	var userId = req.userId;
	
	// check if same project name exists.
	var result = await getProjects(req);
	if(result) {
		for(var index = 0; index < result.length; index++) {
			if(result[index].projectName == title) {
				return false;
			}
		}
	}
	
	var sqlQuery = 'INSERT INTO project (projectName, userId) VALUES (' + database.mysqlEscape(title) + ', ' + database.mysqlEscape(userId) + ')';
	
	console.log('createNewProject Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		console.log('createNewProject failed: ', result);
		return false;
	}
	console.log('createNewProject success');
	return true;
};

async function getProjects(req) {
	var userId = req.userId;
	
	var sqlQuery = 'SELECT * FROM project WHERE userId = ' + database.mysqlEscape(userId);
	
	console.log('getProjects Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		return null;
	}
	
	var results = [];
	for(var index = 0; index < result.length; index++) {
		var info = {
				projectId: result[index].id,
				projectName: result[index].projectName,
				userId: result[index].userId
			};
			results.push(info);
	}
	
	return results;
};

async function getProjectByName(req) {
	var result = await getProjects(req);
	
	if(!result) {
		return null;
	}
	
	for(var index = 0; index < result.length; index++) {
		if(result[index].projectName == req.title) {
			return result[index];
		}
	}
	
	return null;
}

async function getProjectById(req) {
	var result = await getProjects(req);
	
	if(!result) {
		return null;
	}
	
	for(var index = 0; index < result.length; index++) {
		if(result[index].projectId == req.projectId) {
			return result[index];
		}
	}
	
	return null;
}

async function createNewTaskList(req) {
	var projectId = req.projectId;
	var title = req.title;
	var userId = req.userId;
	
	var result = await getTaskLists(req);
	if(result) {
		for(var index = 0; index < result.length; index++) {
			if(result[index].taskListName == title) {
				return false;
			}
		}
	}
	
	var sqlQuery = 'INSERT INTO taskList (title, projectId, userId) VALUES (' + database.mysqlEscape(title) + ',' + database.mysqlEscape(projectId) + ',' + database.mysqlEscape(userId) + ')';
	
	console.log('createNewTaskList Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	
	if(!result) {
		return false;
	}
	return true;
};

async function getTaskLists(req) {
	var projectId = req.projectId;
	
	var sqlQuery = 'SELECT * FROM taskList where projectId = ' + database.mysqlEscape(projectId);
	
	console.log('getTaskList Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	
	if(!result) {
		return null;
	}
	
	var results = [];
	for(var index = 0; index < result.length; index++) {
		var info = {
				taskListId: result[index].taskListId,
				projectId: result[index].projectId,
				taskListName: result[index].title,
				userId: result[index].userId
			};
			results.push(info);
	}
	
	return results;
};

async function getTaskListByTitle(req) {
	var result = await getTaskLists(req);
	
	if(!result) {
		return null;
	}
	
	for(var index = 0; index < result.length; index++) {
		if(result[index].taskListName == req.title) {
			return result[index];
		}
	}
	
	return null;
}

async function getTaskListById(req) {
	var taskListId = req.taskListId;
	
	var sqlQuery = 'SELECT * FROM taskList where taskListId = ' + database.mysqlEscape(taskListId);
	
	console.log('getTaskListById Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	
	if(!result) {
		return null;
	}
	
	var results = [];
	for(var index = 0; index < result.length; index++) {
		var info = {
				taskListId: result[index].taskListId,
				projectId: result[index].projectId,
				taskListName: result[index].title,
				userId: result[index].userId
			};
			results.push(info);
	}
	
	return results;
}

async function createNewTask(req) {
	var taskListId = req.taskListId;
	var taskTitle = req.title;
	var todo = req.todo;
	var userId = req.userId;
	
	console.log('createNewTask 111: ');
	var currentTasks = await getTasks(req);
	console.log('createNewTask 222: ');
	var order = 1;
	if(currentTasks) {
		order = currentTasks.length + 1;
	}
	
	var sqlQuery = '';
	if(!req.taskId) { // if it is a new task creation
		sqlQuery = 'INSERT INTO task (taskListId, title, todo, userId, orderInList) VALUES (' + database.mysqlEscape(taskListId) + ', ' + database.mysqlEscape(taskTitle) + ', ' + database.mysqlEscape(todo) + ',' + database.mysqlEscape(userId) + ',' + order + ')';
	} else { // if it is move from old task list to new task list
		sqlQuery = 'INSERT INTO task (taskId, taskListId, title, todo, userId, orderInList) VALUES (' + database.mysqlEscape(req.taskId) + ',' + database.mysqlEscape(taskListId) + ', ' + database.mysqlEscape(taskTitle) + ', ' + database.mysqlEscape(todo) + ',' + database.mysqlEscape(userId) + ',' + order + ')';
	}
	
	console.log('createNewTask Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	console.log('createNewTask 333: ');
	if(!result) {
		return false;
	}
	return true;
};

async function getTasks(req) {
	var taskListId = req.taskListId;
	
	var sqlQuery = 'SELECT * FROM task where taskListId = ' + database.mysqlEscape(taskListId);
	
	console.log('getTask Query is: ', sqlQuery);
	
	var result = await database.executeQuery(sqlQuery);
	
	if(!result) {
		return null;
	}
	
	var results = [];
	for(var index = 0; index < result.length; index++) {
		var info = {
				taskId: result[index].taskId,
				taskListId: result[index].taskListId,
				userId: result[index].userId,
				title: result[index].title,
				todo: result[index].todo,
				orderInList: result[index].orderInList
			};
			results.push(info);
	}
	
	return results;
};

async function getTaskByName(req) {
	var result = await getTasks(req);
	if(!result) {
		return null;
	}
	
	for(var index = 0; index < result.length; index++) {
		if(result[index].title == req.taskTitle) {
			return result[index];
		}
	}
	
	return null;
}

async function getTaskById(req) {
	var result = await getTasks(req);
	if(!result) {
		return null;
	}
	
	for(var index = 0; index < result.length; index++) {
		console.log('result task id: ', result[index].taskId);
		console.log('req task id: ', req.taskId);
		if(result[index].taskId == req.taskId) {
			return result[index];
		}
	}
	
	return null;
}

async function switchTaskWithinList(req) {
	var taskId = req.taskId;
	var currentOrder;
	var switchOrder = req.switchOrder;
	
	var currentTasks = await getTasks(req);
	
	if(!currentTasks) {
		return false;
	}
	
	var id1, id2;
	for(var index = 0; index < currentTasks.length; index++) {
		var task = currentTasks[index];
		if(task.orderInList && task.taskId == taskId) {
			id1 = taskId;
			currentOrder = task.orderInList;
		}
		if(task.orderInList == switchOrder) {
			id2 = task.taskId;
			console.log('id2: ', id2);
		}
		
		if(id1 && id2) {
			console.log('ids are all found');
			break;
		}
	}
	
	console.log('id1: ', id1);
	console.log('to order: ', switchOrder);
	console.log('id2: ', id2);
	console.log('to order: ', currentOrder);
	
	if(id1 && id2) {
		var sqlQuery1 = 'UPDATE task SET orderInList = ' + switchOrder + ' WHERE taskId = ' + id1;
		var sqlQuery2 = 'UPDATE task SET orderInList = ' + currentOrder + ' WHERE taskId = ' + id2;
		
		console.log('sqlQuery1: ', sqlQuery1);
		console.log('sqlQuery2: ', sqlQuery2);
		
		var result1 = await database.executeQuery(sqlQuery1);
		var result2 = await database.executeQuery(sqlQuery2);
		
		console.log('result1: ', result1);
		console.log('result2: ', result2);
		
		if(!result1 && !result2) {
			console.log('return false');
			return false;
		} else {
			console.log('return true');
			return true;
		}
	}
	console.log('return false');
	return false;
}

async function removeTask(req) {
	var taskId = req.taskId;
	var taskListId = req.taskListId;
	
	var sqlQuery = 'DELETE FROM task WHERE taskId=' + taskId + ' AND taskListId=' + taskListId;
	var result = await database.executeQuery(sqlQuery);
	if(!result) {
		console.log('DELETE task failed: ', result);
		return false;
	}
	return true;
}

async function moveTaskToOtherList(req) {
	var moveToTaskListId = req.moveToTaskListId;
	
	console.log('111');
	var task = await getTaskById(req);
	console.log('222: ', task);
	if(!task) {
		return false;
	}
	
	var result = await removeTask(req);
	console.log('333: ', result);
	if(!result) {
		return false;
	}
	
	req.taskListId = moveToTaskListId;
	req.title = task.title;
	req.todo = task.todo;
	console.log('new req: ', req);
	var moveResult = await createNewTask(req);
	console.log('444: ', moveResult);
	if(!moveResult) {
		console.log('move failed: ', moveResult);
		return false;
	}
	return true;
}

exports.getUserInfo = getUserInfo;
exports.saveLoginInfo = saveLoginInfo;
exports.removeLoginInfo = removeLoginInfo;
exports.checkLoginInfo = checkLoginInfo;
exports.addNewUser = addNewUser;
exports.updateUser = updateUser;
exports.createNewProject = createNewProject;
exports.getProjects = getProjects;
exports.getProjectByName = getProjectByName;
exports.getProjectById = getProjectById;
exports.createNewTaskList = createNewTaskList;
exports.getTaskLists = getTaskLists;
exports.getTaskListByTitle = getTaskListByTitle;
exports.getTaskListById = getTaskListById;
exports.createNewTask = createNewTask;
exports.getTasks = getTasks;
exports.getTaskByName = getTaskByName;
exports.getTaskById = getTaskById;
exports.switchTaskWithinList = switchTaskWithinList;
exports.moveTaskToOtherList = moveTaskToOtherList;