CREATE DATABASE IF NOT EXIST tw-database;
CREATE TABLE users (id varchar(255) NOT NULL, password varchar(255) NOT NULL, fname varchar(40) NOT NULL, lname varchar(40) NOT NULL, email varchar(255) NOT NULL, PRIMARY KEY(id));
CREATE TABLE project (id INT NOT NULL AUTO_INCREMENT, projectName varchar(255) NOT NULL, userId varchar(255) NOT NULL, PRIMARY KEY(id));
CREATE TABLE taskList (taskListId INT NOT NULL AUTO_INCREMENT, projectId INT NOT NULL, PRIMARY KEY(taskListId));
CREATE TABLE task (taskId INT NOT NULL AUTO_INCREMENT, taskListId INT NOT NULL, PRIMARY KEY(taskId));