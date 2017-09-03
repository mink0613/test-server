var database = require('./database-createDB-table.js');

database.createDB();
database.createTableUser();
database.createTableProject();
database.createTableTaskList();
database.createTableTask();
