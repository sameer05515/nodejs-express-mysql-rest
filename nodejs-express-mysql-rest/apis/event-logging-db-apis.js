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


exports.updateLabelById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('UPDATE t_label set label=?,description=?,updated_on=current_timestamp(),enabled=? WHERE id=?',
                    [req.body.label, req.body.description, req.body.enabled, req.params.id], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully updated label data! \'',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.addLabel = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('INSERT INTO t_label(label, description) values (?,?)',
                    [req.body.label, req.body.description], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully saved label data! \'' + req.body.label +
                                            '\' and \'' + req.body.description + '\' are connected.',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.allLabel = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('select * from t_label', function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

exports.getLabelById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, label, description, created_on, updated_on, enabled FROM t_label where id=?;', [req.params.id], function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

/** EVENTS */

exports.addEvent = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('INSERT INTO t_event(title, detail, event_date) VALUES (?,?,?)',
                    [req.body.title, req.body.detail,req.body.event_date], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully saved event data! \'' + req.body.title +
                                            '\' and \'' + req.body.description + '\' are connected.',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.updateEventById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('UPDATE t_event set title=?,detail=?,event_date=?,updated_on=current_timestamp(),enabled=? WHERE id=?',
                    [req.body.title, req.body.detail, req.body.event_date, req.body.enabled, req.params.id], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully updated event data! \'',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.allEvent = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('select * from t_event', function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

exports.getEventById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, title, detail, event_date, created_on, updated_on, enabled FROM t_event where id=?;', [req.params.id], function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched event data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

/**Event Label Relation*/

exports.addEventLabelRelation=(req,res)=>{
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('INSERT INTO t_event_label_relation(event_id, label_id, remarks, deleted) VALUES (?,?,?,?)',
                    [req.body.event_id, req.body.label_id,req.body.remarks,req.body.deleted], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully saved event-label-relation data! \'' + req.body + '\' .',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.updateEventLabelRelationById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        }

        connection.beginTransaction(function (err) {
            if (!err) {
                connection.query('UPDATE t_event_label_relation SET remarks=?,updated_on=current_timestamp(),deleted=? \
                WHERE event_id=? and label_id=?',
                    [req.body.remarks, req.body.deleted, req.params.event_id, req.params.label_id], function (err, results) {

                        if (!err) {



                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        res.send({ 'result': 'Error while updating data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                                    });
                                } else {
                                    console.log('Transaction Complete.');
                                    connection.release();
                                    res.send({
                                        'result': 'Successfully updated event-label-relation data! \'',
                                        'status': 'Success', 'description': 'Success', 'data': { 'results': results }
                                    });
                                }
                            });
                        } else {
                            connection.rollback(function () {
                                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail Validation: Rollbacking data', 'data': err });
                            });

                        }




                    });
            } else {
                res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            }
        });

        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });

        });
    });
};

exports.allEventLabelRelation = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, event_id, label_id, remarks, created_on, updated_on, deleted FROM t_event_label_relation', 
        function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched event-label-relation data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

exports.getEventLabelRelationById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, event_id, label_id, remarks, created_on, updated_on, deleted FROM t_event_label_relation \
        where event_id=? and label_id=?;', [req.params.event_id,req.params.label_id], function (err, results) {
            connection.release();
            if (!err) {
                console.log('req.params.event_id : '+req.params.event_id);
                console.log('req.params.label_id : '+req.params.label_id);
                res.send({
                    'result': 'Successfully fetched event-label-relation data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

exports.getEventLabelRelationByLabelId = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, event_id, label_id, remarks, created_on, updated_on, deleted FROM t_event_label_relation \
        where label_id=?;', [req.params.label_id], function (err, results) {
            connection.release();
            if (!err) {
                console.log('req.params.label_id : '+req.params.label_id);
                res.send({
                    'result': 'Successfully fetched event-label-relation data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};

exports.getEventLabelRelationByEventId = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        connection.query('SELECT id, event_id, label_id, remarks, created_on, updated_on, deleted FROM t_event_label_relation \
        where event_id=? ;', [req.params.event_id], function (err, results) {
            connection.release();
            if (!err) {
                console.log('req.params.event_id : '+req.params.event_id);
                res.send({
                    'result': 'Successfully fetched event-label-relation data!',
                    'status': 'Success', 'description': 'Success', 'data': {'results':results}
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};


exports.getUUID = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        }
        //connection.query('GenerateUniqueValue(?,\'t_event\',\'id\');', [req.params.count], function (err, results) {
        connection.query('SELECT LEFT(UUID(), ?) as id;', [req.params.count], function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': results
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': 'Fail', 'data': err });
            return;
        });
    });
};