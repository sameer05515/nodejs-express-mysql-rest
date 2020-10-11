const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
var path = require('path');
var async = require('async')

app.use(bodyParser.json());

var mysqlConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "interview_mgmt",
    multipleStatements: true
});

var mysqlConnRelGrphRep = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "relation-graph-representation",
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

app.get('/test1', function (req, res) {

    var userId = req.params.userId;
    async.parallel({
        nodes: function (callback) {
            mysqlConnRelGrphRep.query('SELECT id,name,label FROM t_person', callback)
        },
        links: function (callback) {
            mysqlConnRelGrphRep.query('SELECT source,target,relation_type as type FROM t_person_relation', callback)
        }
    },
        // Final callback, with all the results
        function (err, results) {
            //results now has {nodes: ..., links: ...}
            var data = { 'nodes': [], 'links': [] };
            data.nodes = results.nodes;
            data.links = results.links;

            //   var user = results.user;
            //   user.photos = results.photos;
            res.status(200).end(JSON.stringify(data));
        });


});

app.get('/test', async (req, res) => {
    var data = { 'nodes': [], 'links': [] }

    mysqlConnRelGrphRep.query("SELECT * FROM t_person", (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            data.nodes = { ...rows };
            //res.send(nodeData);
        } else {
            console.log(err);
        }
    });

    mysqlConnRelGrphRep.query("SELECT * FROM t_person_relation", (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            data.links = { ...rows };
            //res.send(edgeData);
        } else {
            console.log(err);
        }
    });


    res.send(data);
});

app.get('/relation-graph-representation/person', (req, res) => {
    var nodeData = [];
    // var edgeData=[];
    mysqlConnRelGrphRep.query("SELECT * FROM t_person", (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            nodeData = rows;
            res.send(nodeData);
        } else {
            console.log(err);
        }
    });
    // mysqlConnRelGrphRep.query("SELECT * FROM t_person_relation",(err,rows,fields)=>{
    //     if(!err){
    //         //res.send(rows);
    //         edgeData=rows;
    //         console.log(edgeData);
    //     }else{
    //         console.log(err);
    //     }
    // });

    //res.send({'nodes':nodeData,'links':edgeData});
});

app.get('/relation-graph-representation/person/relation', (req, res) => {
    // var nodeData=[];
    var edgeData = [];
    // mysqlConnRelGrphRep.query("SELECT * FROM t_person",(err,rows,fields)=>{
    //     if(!err){
    //         //res.send(rows);
    //         nodeData=rows;
    //         console.log(nodeData);
    //     }else{
    //         console.log(err);
    //     }
    // });
    mysqlConnRelGrphRep.query("SELECT * FROM t_person_relation", (err, rows, fields) => {
        if (!err) {
            //res.send(rows);
            edgeData = rows;
            res.send(edgeData);
        } else {
            console.log(err);
        }
    });

    // res.send({'nodes':nodeData,'links':edgeData});
});

//app.delete()
