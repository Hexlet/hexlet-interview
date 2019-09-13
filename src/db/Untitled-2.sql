-- SQLite
DROP TABLE user;

CREATE TABLE user (
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   first_name TEXT,
   last_name TEXT,
   email TEXT,
   password TEXT,
   enabled INTEGER,
   role TEXT);

INSERT INTO user (first_name, last_name, email, password, enabled, role)
   VALUES ('Alexey', 'Petrov', 'alexey_petrov@gmail.com', '12345', '1', 'USER');
INSERT INTO user (first_name, last_name, email, password, enabled, role)
   VALUES ('Igor', 'Ivanov', 'igor_ivanov@gmail.com', '12345', '1', 'USER');
INSERT INTO user (first_name, last_name, email, password, enabled, role)
   VALUES ('Nadezhda', 'Umiraet', 'nadezhda_umiraet@gmail.com', '12345', '1', 'USER');
