/*
await, mysql-promise, async를 적용시킨 api
*/
const express = require('express');
const router = express.Router();
const moment = require('moment');
const now = moment(new Date()).format('YYYY-MM-DD, h:mm:ss a');
const aws = require('aws-sdk');
const async = require('async');
aws.config.loadFromPath('./config/aws_config.json');
const s3 = new aws.S3();
const pool = require('../config/db_pool');
const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ektmf1993',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});
//전체 게시글 조회
router.get('/', async function(req, res) {
    try {
        var connection = await pool.getConnection();
        let query = 'select * from board order by written_time desc';
        let data = await connection.query(query);
        res.status(200).send({result : data, message : 'ok1'});
    }catch(err) {
        res.status(500).send({result : [], message : 'selecting all posts error : ' + err});
    }finally {
        pool.releaseConnection(connection);
    }
});

//특정 게시글 조회
router.get('/:id', async (req, res) => {
    try {
        let token = req.hearders.token;
        let secretKey = req.app.get('jwt-secret');
        console.log(token);
        let decode = jwt.verify(token, secretKey);
        if(!decode) {
            res.status(400).send({message : "worng token"});
        }else {
            var connection = await pool.getConnection();
            await connection.beginTransaction();
            let query1 = 'update posts set view_number = view_number + 1 where id = ?';
            await connection.query(query1, req.params.id);
            let query2 = 'select * from posts where id = ?'; //게시글 가져오기
            let post = await connection.query(query2, req.params.id);
            let query3 = 'select writer, written_time, content from comments where post_id = ?'; //게시글에 달린 댓글들 가져오기
            let comments = await connection.query(query3, req.params.id);
            res.status(200).send( { result: { post: post[0], comment: comments }, message: 'ok' });
            await connection.commit();
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send( { message: err });
        await connection.rollback();
    }
    finally{
        pool.releaseConnection(connection);
    }

});

//게시글 작성
router.post('/', upload.single('image'), function(req, res) {
    console.log(req.body);
    const write = [
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
            var query = 'insert into board(writer, title, written_time, content, image_url) values(?, ?, ?, ?, ?)';
            var imageUrl;
            if (!req.file) {
                imageUrl = null;
            } else {
                imageUrl = req.file.location;
            }
            connection.query(query, [req.body.writer, req.body.title, now, req.body.content, imageUrl], function(err, data) {
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
//댓글 작성
router.post('/:id', function(req, res) {
    console.log(req.body);
    console.log(req.params);
    const write_comment = [
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
            var query = 'insert into comments(board_id, writer, written_time, content) values(?, ?, ?, ?)';
            connection.query(query, [Number(req.params.id), req.body.writer, now, req.body.content], function(err, data) {
                if (err) {
                    console.log("query error : ", err);
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
    async.waterfall(write_comment, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
});

module.exports = router;
