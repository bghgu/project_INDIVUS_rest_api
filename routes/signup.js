const express = require('express');
const router = express.Router();
const pool = require('../config/db_pool2.js');
const jwt = require('jsonwebtoken');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');
const async = require('async');
const moment = require('moment');
const now = moment(new Date()).format('YYYY-MM-DD, h:mm:ss a');

//전체 회원가입 정보 조회
router.get('/', function(req, res) {
    const all_lists = [
        function(callback) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            var query = 'select * from Signup';
            connection.query(query, function(err, data) {
                if (err) {
                    console.log("query err", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(200).send({
                        message: 'ok',
                        result: data
                    });
                }
                connection.release();
            });
        }
    ];
    async.waterfall(all_lists, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

//회원가입 정보 입력
router.post('/', function(req, res){
  console.log(req.body);
    const write = [
        function(callback) {
            console.log(1);
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.log('getConnection error : ', err);
                    res.status(500).send({
                        message: 'Error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            console.log(2);
            var query = 'Select email from Signup where email = ?';
            connection.query(query, [req.body.email], function(err, data) {
                if (err) {
                    console.log("error : ", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(201).send({
                        message: "ok"
                    });
                    callback(null, connection);
                }
            });
        },
        function(connection, callback) {
            console.log(3);
            var query = 'insert into Signup(email, password, username) values(?, ?, ?)';
            connection.query(query, [req.body.email, req.body.password, req.body.username], function(err, data) {
                if (err) {
                    console.log("error : ", err);
                    res.status(503).send({
                        message: 'selecting all posts error : ' + err,
                        result: ''
                    });
                    callback(err, null);
                } else {
                    res.status(201).send({
                        message: "ok"
                    });
                }
            });
            connection.release();
        }
    ];
    async.waterfall(write, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

module.exports = router;
