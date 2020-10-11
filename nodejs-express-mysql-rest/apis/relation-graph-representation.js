const mysql = require('mysql');
const bodyParser = require('body-parser');
var async = require('async');

var mysqlConnRelGrphRep = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "relation-graph-representation",
    multipleStatements: true
});

exports.addRelation=async (req,res)=>{
    var source=req.body.source;
    var target=req.body.target;
    var type=req.body.type;

    // res.send({'result':'Successfully saved relation! '+source+' is '+type+' of '+target+''});

    mysqlConnRelGrphRep.query('INSERT INTO t_person_relation(source, target, relation_type) VALUES (?,?,?)',[source,target,type],(err,result)=>{
        if(!err){
            res.send({'result':'Successfully saved relation! ${source} is ${type} of ${target}',
        'status':'Success','description':'Success'});
        }else{
            res.send({'result':'Error while saving data','status':'Fail','description':err});
        }
    })

};

exports.relationsAll=(req, res) => {
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
};

exports.personsAll=(req, res) => {
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
};

exports.combinedPersonRelationAll=async (req, res) => {
    //var data = { 'nodes': [], 'links': [] };

    async.parallel({
        nodes: function (callback) {
            mysqlConnRelGrphRep.query("SELECT id,name,label FROM t_person", (err, rows, fields) => {
                if (!err) {
                    callback(null, rows);
                } else {
                    console.log(err);
                    callback(err, []);
                }
            })
        },
        links: function (callback) {
            mysqlConnRelGrphRep.query("SELECT source,target,relation_type as type FROM t_person_relation", (err, rows, fields) => {
                if (!err) {
                    callback(null, rows);
                } else {
                    console.log(err);
                    callback(err, []);
                }
            })
        }
    },
        // Final callback, with all the results
        function (err, results) {
            //results now has {nodes: ..., links: ...}
            var data = { 'nodes': [], 'links': [] };
            data.nodes = results.nodes;
            data.links = results.links;

            res.status(200).end(JSON.stringify(data));
        });

};


exports.combinedPersonRelationByPersonId =async function (req, res) {

    var personId = req.params.personId;
    async.parallel({
        nodes: function (callback) {
            mysqlConnRelGrphRep.query('SELECT id,name,label FROM t_person where id=? \
            union \
            SELECT id,name,label FROM t_person where id in \
                ( \
                    SELECT target FROM t_person_relation WHERE source=? \
                    UNION \
                    SELECT source FROM t_person_relation WHERE target=? \
                )', [personId,personId,personId], (err, rows, fields) => {
                if (!err) {
                    callback(null, rows);
                } else {
                    console.log(err);
                    callback(err, []);
                }
            })
        },
        links: function (callback) {
            mysqlConnRelGrphRep.query('SELECT source,target,relation_type as type FROM t_person_relation WHERE source=?\
            UNION\
            SELECT source,target,relation_type as type FROM t_person_relation WHERE target=?', [personId, personId], (err, rows, fields) => {
                if (!err) {
                    callback(null, rows);
                } else {
                    console.log(err);
                    callback(err, []);
                }
            })
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


};