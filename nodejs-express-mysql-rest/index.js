const mysql =require('mysql');
const express=require('express');
var app=express();
const bodyParser=require('body-parser');

app.use(bodyParser.json());

var mysqlConn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"interview_mgmt",
    multipleStatements:true
});

mysqlConn.connect((err)=>{
    if(!err){
        console.log("db connection succeeded!");
    }else{
        console.log("db connection failed!"+JSON.stringify(err,undefined,2));
    }
});

app.listen(3000,()=>{console.log("Express server is running at port 3000")});

app.get('/interview/categories',(req,res)=>{
    mysqlConn.query("select * from t_category",(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

app.get('/interview/categories/:categoryId',(req,res)=>{
    mysqlConn.query("select * from t_category where cat_id=?",[req.params.categoryId],(err,rows,fields)=>{
        if(!err){
            console.log("data recieved! for : "+req.params.categoryId);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

//app.delete()

