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
                                        'status': 'Success', 'description': 'Success', 'data': { 'newId': results }
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
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        }
        connection.query('select * from t_label', function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': results
                });
            }

        });
        connection.on('error', function (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        });
    });
};

exports.getLabelById = (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        }
        connection.query('SELECT id, label, description, created_on, updated_on, enabled FROM t_label where id=?;', [req.params.id], function (err, results) {
            connection.release();
            if (!err) {

                res.send({
                    'result': 'Successfully fetched label data!',
                    'status': 'Success', 'description': 'Success', 'data': results
                });
            }

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
            res.send({ 'result': 'Error while saving data', 'status': 'Fail', 'description': err });
            return;
        });
    });
};