const mysql = require('mysql');
const bodyParser = require('body-parser');
var async = require('async');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'event-logging-db',
    multipleStatements: true
});

// var mysqlConnRelGrphRep = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "relation-graph-representation",
//     multipleStatements: true
// });

exports.addLabel = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            //return;
        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('INSERT INTO t_label(label, description) values (?,?)',
                    [req.body.label, req.body.description], function (err, results) {
                        
                        if (!err) {
                            
                            // res.send({
                            //     'result': 'Successfully saved label data! \'' + req.body.label +
                            //         '\' and \'' + req.body.description + '\' are connected.',
                            //     'status': 'Success', 'description': 'Success', 'data': { 'newId': results.insertId }
                            // });

                            connection.commit(function(err){
                                if(err){
                                    connection.rollback(function() {
                                        res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                      }); 
                                }else{
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully saved label data! \'' + req.body.label +
                                            '\' and \'' + req.body.description + '\' are connected.',
                                        'status': 'Success', 'description': 'Success', 'data': { 'newId': results.insertId }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function() {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                              });
                            
                        }

                        

                        //connection.release();
                        // check null for results here
                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            //return;
        });
    });
};

exports.allLabel = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        }
        connection.query('select * from t_label', function (err, results) {
            connection.release();
            if (!err) {
                // callback(false, { rows: results });
                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': results
                });
            }
            // check null for results here
        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        });
    });
};

exports.getUUID = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        }
        connection.query('SELECT LEFT(UUID(), ?) as id;',[req.params.count], function (err, results) {
            connection.release();
            if (!err) {
                // callback(false, { rows: results });
                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': results
                });
            }
            // check null for results here
        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        });
    });
};