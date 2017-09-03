var User = function(userId, password, fname, lname, email) {
	this.userId = userId;
	this.password = password;
	this.fname = fname;
	this.lname = lname;
	this.email = email;
};

function create(userId, password, fname, lname, email) {
	return new User(userId, password, fname, lname, email);
}

function check(userId, password) {
	return new User(userId, password, '', '', '');
}

module.exports.create = create;
module.exports.check = check;