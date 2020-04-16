const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory'
});

db.connect();
console.log('Successfully connected to DB');  

app.listen(3000, () => {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;