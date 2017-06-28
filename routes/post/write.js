const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');
const s3 = new aws.S3();
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

router.post('/', upload.single('card_cover'), async(req, res, next) => {
    try {
        var connection = await pool.getConnection();
        console.log(req.body);
        let data = {
            ID: 11,
            title: req.body.title,
            sub_title: req.body.sub_title,
            explain: req.body.explain,
            content: req.body.content,
            comment: req.body.comment,
            card_cover: req.file ? req.file.location : null
        };
        let write = 'insert into Posts set ?';
        let inserted = await connection.query(write, data);
        console.log(inserted);
        res.status(201).send({message: 'writing success'});
    } catch (err) {
        console.log(err);
        next(err);
        //res.status(500).send({message: err });
    } finally {
        pool.releaseConnection(connection);
    }
});

module.exports = router;
