const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
var path = require('path');
var async = require('async');

var cors = require('cors');

app.use(cors());

var relGrphRepr=require("./apis/relation-graph-representation");
var relEventLoggingApi=require("./apis/event-logging-db-apis");

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

app.post('/relation-graph-representation/person/relation/',relGrphRepr.addRelation);

//app.delete()

app.post('/event-logging/label/',relEventLoggingApi.addLabel);
app.get('/event-logging/label/all',relEventLoggingApi.allLabel);
app.get('/event-logging/label/:id',relEventLoggingApi.getLabelById);
app.put('/event-logging/label/:id',relEventLoggingApi.updateLabelById);

app.get('/getUUID/:count',relEventLoggingApi.getUUID);

app.post('/event-logging/event/',relEventLoggingApi.addEvent);
app.get('/event-logging/event/all',relEventLoggingApi.allEvent);
app.get('/event-logging/event/:id',relEventLoggingApi.getEventById);
app.put('/event-logging/event/:id',relEventLoggingApi.updateEventById);

app.post('/event-logging/event-label-relaion/',relEventLoggingApi.addEventLabelRelation);
app.get('/event-logging/event-label-relaion/all',relEventLoggingApi.allEventLabelRelation);
app.get('/event-logging/event-label-relaion/event/:event_id/label/:label_id',relEventLoggingApi.getEventLabelRelationById);
app.get('/event-logging/event-label-relaion/event/:event_id',relEventLoggingApi.getEventLabelRelationByEventId);
app.get('/event-logging/event-label-relaion/label/:label_id',relEventLoggingApi.getEventLabelRelationByLabelId);
app.put('/event-logging/event-label-relaion/event/:event_id/label/:label_id',relEventLoggingApi.updateEventLabelRelationById);