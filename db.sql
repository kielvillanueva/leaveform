CREATE DATABASE inventory;

use inventory;

CREATE TABLE items (
    id int NOT NULL,
    name varchar(200) NOT NULL,
    qty int NOT NULL,
    amount float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE items ADD PRIMARY KEY (id);

ALTER TABLE items MODIFY id int(11) NOT NULL AUTO_INCREMENT;