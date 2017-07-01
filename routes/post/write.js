const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const aws = require('aws-sdk');
//aws.config.loadFromPath('../config/awsConfig.json');
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
    const ID = jwt.verify(req.headers.authorization);
    const categories = req.body.categories;
    let write = 'insert into Posts set ?';
    let selectCatrgory = 'insert into Post_Categorys';
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        let data = {
            ID_creator: ID,
            title: req.body.title,
            sub_title: req.body.sub_title,
            explain: req.body.explain,
            content: req.body.content,
            comment: req.body.comment,
            card_cover: req.file ? req.file.location : null,
            category_id : req.body.category_id
        };
        let result = await db.execute(write, data);
        res.status(200).send({
            message: "write success"
        });
    //토큰 검증이 실패할 경우
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});
module.exports = router;
