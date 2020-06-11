const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser())
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
  
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'company'
});

db.connect();
console.log('Successfully connected to DB');  

app.get('/', (req, res) => {

    res.cookie('user', null);
    res.render('index', { title: 'Welcome Page'});

});

app.get('/user', (req, res) => {

    if(!req.cookies['user']) {
        res.redirect('/');
    }
    res.render('userHome', { title: 'User Home Page', name: req.cookies['user'], announcement: false });

});

app.post('/user', (req, res) => {

    if(!req.body['user']) {
        res.redirect('/');
    }
    var name = req.body['user'];

    db.query('SELECT * FROM users where name=?', name, function (error, results) {

        if (error) return res.render('500', { title: 'Error Page', error});
        
        console.log('Rows Returned: ', results.length);

        if(results.length == 0) {
            var user = {
                name
            };

            const numberOfLeaves = 15; // Assumed 15 days of leaves per year
            const monthToday = new Date().getMonth() +1;
            user['leaves'] = Math.floor((monthToday / 12) * numberOfLeaves); // Accumulated Leaves for this year


            db.query("INSERT INTO users SET ? ", user, function (error, results, fields) {

                if (error) return res.render('500', { title: 'Error Page', error});
        
                res.cookie('user', name);
                return res.render('userHome', { title: 'User Home Page', name, announcement: false });
        
            });

        } else {
            res.cookie('user', name);
            return res.render('userHome', { title: 'User Home Page', announcement: false, ...results[0]});
        }

    });

});

app.get('/user/leaves', (req, res) => {

    if(!req.cookies['user']) {
        res.redirect('/');
    }
    var name = req.cookies['user'];

    db.query('SELECT * FROM users where name=?', name, function (error, results) {

        if (error) return res.render('500', { title: 'Error Page', error});
        
        if(results.length == 0) {
            res.redirect('/');
        } else {

            var remainingLeaves = results[0]['leaves'];
            var user_id = results[0]['id'];
            db.query('SELECT * FROM leaves where user_id=?', user_id, function (error, results) {

                if (error) return res.render('500', { title: 'Error Page', error});

                return res.render('leaves', { title: 'Leaves Page', name: req.cookies['user'], leaves: remainingLeaves, results: results});
        
            });
        }

    });

});

app.get('/user/file', (req, res) => {

    if(!req.cookies['user']) {
        res.redirect('/');
    }

    res.render('file', { title: 'Filing of Leaves Page', name: req.cookies['user'], error: false });

});

app.post('/user/file', (req, res) => {

    if(!req.cookies['user']) {
        res.redirect('/');
    }
    var name = req.cookies['user'];

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const beginning = new Date(req.body['beginning']);
    const ending = new Date(req.body['ending']);
    var days = [];

    for(var d = beginning; d <= ending; d.setDate(d.getDate() + 1)) {
        days.push(weekdays[d.getDay()]);
    }

    const weekends = ['Saturday', 'Sunday'];
    for(var key in weekends) {
        var index = days.indexOf(weekends[key]);
        while (index > -1) {
            days.splice(index, 1);
            index = days.indexOf(weekends[key]);
        }
    }

    db.query('SELECT * FROM users where name=?', name, function (error, results) {

        if (error) return res.render('500', { title: 'Error Page', error});
        
        var user_id = results[0]['id'];
        if(results.length == 0) {
            res.redirect('/');
        } else if(results[0]['leaves'] < days.length) {
            return res.render('file', { title: 'Filing of Leaves Page', name, error: 'Not Enough Leaves' });
        } else {

            var length = req.body['type'] == 'Full Day' ? days.length : 0.5;
            var user = {
                leaves: results[0]['leaves'] - length
            }
            db.query("UPDATE users SET ? WHERE id = ?", [user, user_id], function (error, results, fields) {

                if (error) return res.render('500', { title: 'Error Page', error});

                var leave = {
                    user_id: user_id,
                    length,
                    beginning,
                    ending,
                    type: req.body['type']
                }
                db.query("INSERT INTO leaves SET ? ", leave, function (error, results, fields) {

                    if (error) return res.render('500', { title: 'Error Page', error});

                    res.cookie('user', name);
                    return res.render('userHome', { title: 'User Home Page', name, announcement: 'Successfully filed!', error: false });
            
                });
                
            });

        }

    });

});
 
app.listen(3000, () => {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;