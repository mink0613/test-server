CREATE TABLE user (
  id VARCHAR(20) NOT NULL,
  password VARCHAR(32) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email_address VARCHAR(60) NOT NULL,
  PRIMARY KEY (id)
);