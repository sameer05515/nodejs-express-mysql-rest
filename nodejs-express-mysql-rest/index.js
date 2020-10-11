const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
var path = require('path');
var async = require('async');

var relGrphRepr=require("./apis/relation-graph-representation")

//app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(express.json());

var mysqlConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "interview_mgmt",
    multipleStatements: true
});



mysqlConn.connect((err) => {
    if (!err) {
        console.log("db connection succeeded!");
    } else {
        console.log("db connection failed!" + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3000, () => { console.log("Express server is running at port 3000") });

app.get('/', (req, res) => {
    //res.send('Hello World, from express');
    res.sendFile(path.join(__dirname + '/help.html'));
});

app.get('/interview/categories', (req, res) => {
    mysqlConn.query("select * from t_category", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

app.get('/interview/categories/:categoryId', (req, res) => {
    mysqlConn.query("select * from t_category where cat_id=?", [req.params.categoryId], (err, rows, fields) => {
        if (!err) {
            console.log("data recieved! for : " + req.params.categoryId);
            res.send(rows);
        } else {
            console.log(err);
        }
    })
});

app.get('/relation-graph-representation/combined-person-relation/:personId', relGrphRepr.combinedPersonRelationByPersonId);

app.get('/relation-graph-representation/combined-person-relation', relGrphRepr.combinedPersonRelationAll);

app.get('/relation-graph-representation/person', relGrphRepr.personsAll);

app.get('/relation-graph-representation/person/relation', relGrphRepr.relationsAll);

app.post('/relation-graph-representation/person/relation/',relGrphRepr.addRelation)

//app.delete()

