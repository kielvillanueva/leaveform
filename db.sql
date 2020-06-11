CREATE DATABASE company;

use company;

CREATE TABLE users (
    id int NOT NULL,
    name varchar(200) NOT NULL,
    leaves float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE users ADD PRIMARY KEY (id);

ALTER TABLE users MODIFY id int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE leaves (
    id int NOT NULL,
    user_id int NOT NULL,
    beginning DATE NOT NULL,
    ending DATE NULL,
    type varchar(200) NOT NULL,
    length float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE leaves ADD PRIMARY KEY (id);

ALTER TABLE leaves MODIFY id int(11) NOT NULL AUTO_INCREMENT;