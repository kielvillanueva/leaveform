# Leave Form

Run **npm install**

Setup your local **MySQL**

Copy and paste the contents of the file **db.sql** then run inside MySQL

Update these lines in the **server.js** file with your local MySQL credentials
```
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company'
});
```

Run **npm start**

Open a browser and access **localhost:3000**

Enter your name and a new database entry with your name will be created with the Pro rated leaves from January.
