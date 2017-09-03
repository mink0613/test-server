function TaskList(title, userId, projectId, tasks) {
	this.title = title;
	this.userId = userId;
	this.projectId = projectId;
	this.tasks = [];
	for(var index = 0; index < tasks.length; index++) {
		this.tasks.push(tasks[index]);
	}
}