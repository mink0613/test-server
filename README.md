# BRIEF APPLICATION STRUCTURE
* app-restify.js: main application
* sql-db-table.sql: sql query for creating database & tables
* api/: all the apis that main application use
* api/auth/: apis for user authentication, use JWT
* api/database/: apis for accessing database & retrieve data (currently not located here yet)
* api/mode/: models that this application use

# DATABASE CREATION
1. Run command line or terminal
2. Go to a folder where *sql-db-table.sql* file is located
3. Type as following: *your-mysql-location* -u *your-mysql-id*  -p < sql-db-table.sql
* Ex: usr/local/mysql/bin/mysql -u root -p < sql-db-table.sql
4. Type password

# AVAILABLE FUNCTIONS
1. Create a user (sign-up).
* url: localhost:3030:/createUser
* body: { “userId”: “*yourId*”, “password”: “*yourPassword*”, “fname”: “*firstName*”, “lname”: “*lastName*”, “email”: “*youremail@email.com*” }

2. Login (sign-in).
* url: localhost:3030/login
* body: { “userId”: “*yourId*”, “password”: “*yourPassword*” }

3. Logout (sign-out) (requires session).
* url: localhost:3030/logout
* body: { “userId”: “*yourId*”, “password”: “*yourPassword*” }

4. Update a user’s email or name (requires session).
* url: localhost:3030/updateUser
* body: { “userId”: “*yourId*”, “password”: “*yourPassword*”, “fname”: “*firstName*”, “lname”: “*lastName*”, “email”: “*youremail@email.com*” }

5. Retrieve project list (requires session).
* url: localhost:3030/projects/list
* body: {  }

6. Create a project (requires session).
* url: localhost:3030/projects/create
* body: { “title”: “*projectTitle*” }

7. Retrieve a project (requires session).
* url: localhost:3030/projects/project
* body: { “projectId”: “*targetProjectId*” }

8. Create a task list (requires session).
* url: localhost:3030/projects/project/createTaskList
* body: { “title”: “*taskTitle*”, “todo”: “*taskToDo*”, “taskListId”: “*targetTaskListId*” }

9. Create a task (requires session).
* url: localhost:3030/projects/project/taskList/createTask
* body: { “title”: “*taskListTitle*”, “projectId”: “*targetProjectId*” }

10. Move Task within a List or between Lists (require session).
* url: localhost:3030/projects/project/taskList/switchTaskWithinList
* body: { “taskListId”: “*targetTaskListId*”, “taskId”: “*targetTaskId*”, “switchOrder”: “*targetSwitchOrder*” }

11. Move Task between Lists (require session).
* url: localhost:3030/projects/project/taskList/moveTaskToOtherList
* body: { “taskListId”: “*targetTaskListId*”, “moveToTaskListId”: “*targetMoveToTaskListId*”, “taskId”: “*targetTaskId*” }

12. Search Tasks (requires session).
* NOT IMPLEMENTED YET

# TODO
1. IMPLEMENT *Search Task*
2. IMPLEMENT *Unit Test*
3. IMPLEMENT *Integration Test*
4. Remove unnecessary files & re-arrange application structure
5. Catch & fix bugs
