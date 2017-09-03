CREATE DATABASE IF NOT EXISTS tw_database;
CREATE TABLE tw_database.users (id varchar(255) NOT NULL, password varchar(255) NOT NULL, fname varchar(40) NOT NULL, lname varchar(40) NOT NULL, email varchar(255) NOT NULL, PRIMARY KEY(id));
CREATE TABLE tw_database.loginInfo (token varchar(255) NOT NULL, userId varchar(255) NOT NULL, PRIMARY KEY(userId));
CREATE TABLE tw_database.project (id INT NOT NULL AUTO_INCREMENT, projectName varchar(255) NOT NULL, userId varchar(255) NOT NULL, PRIMARY KEY(id));
CREATE TABLE tw_database.taskList (taskListId INT NOT NULL AUTO_INCREMENT, title varchar(255) NOT NULL, projectId INT NOT NULL, userId varchar(255) NOT NULL, PRIMARY KEY(taskListId));
CREATE TABLE tw_database.task (taskId INT NOT NULL AUTO_INCREMENT, taskListId INT NOT NULL, PRIMARY KEY(taskId), title varchar(255) NOT NULL, todo varchar(255) NOT NULL, userId varchar(255) NOT NULL, orderInList INT NOT NULL);
