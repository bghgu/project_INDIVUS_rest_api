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

/*
컨텐츠 작성
*/
var multiUpload = upload.fields([{ name: 'card_cover'}, { name: 'contents'}])
router.post('/', multiUpload, async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const content_type = req.body.content_type;
    const series_name = req.body.title;
    const keycard = req.body.keycard;
    const each_content_type = req.body.each_content_type;
    let write = 'insert into Posts set ?';
    let insertContents = 'insert into Contents set ?';
    let insertSeries = 'update Series set post_id = ? where ID_creator = ? and series_name = ?';
    let insertDefault = 'insert into DefaultSeries set ?';
    let selectCatrgory = 'insert into Post_Categorys';
    let checkSeries = 'select * from Series where series_name = ? and ID_creator = ?';
    let updateKeycard = 'insert into Post_Keycards values(?, (select keycard_id from Keycards where keycard_name = ?))';
    let result, check;
    let text = 0;
    let file = 0;
    console.log(keycard);
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        let data = {
            ID_creator: ID,
            title: series_name,
            sub_title: req.body.sub_title,
            explain: req.body.explain,
            comment: req.body.comment,
            card_cover: req.files.card_cover ? req.files.card_cover[0].location : null,
            category_id : req.body.category_id,
            content_type : req.body.content_type
        };
        //post_id 받기
        result = await db.execute(write, data);
        const post_id = result.insertId;
        //컨텐츠 내용 등록
        for(i = 0; i < each_content_type.length; i++) {
            //컨텐츠가 텍스트일 경우
            if(each_content_type[i] == 0) {
                let contents = {
                    post_id : post_id,
                    contents : req.body.contents[text],
                    type : "text"
                };
                result = await db.execute(insertContents, contents);
                text++;
            }
            //
            else {
                let contents = {
                    post_id : post_id,
                    contents : req.files.contents[file].location,
                    type : "image"
                };
                result = await db.execute(insertContents, contents);
                file++;
            }
        }
        //
        for(i = 0; i < keycard.length; i++) {
            result = await db.execute3(updateKeycard, post_id, keycard[i]);
        }
        //단편일 경우
        if(content_type == 0) {
            let data = {
                ID_creator: ID,
                post_id : post_id
            };
            result = await db.execute(insertDefault, data);
        }
        //시리즈일 경우
        else {
            check = await db.execute3(checkSeries, series_name, ID);
            if(check.length == 0) {
                result = await db.execute4(insertSeries, post_id, ID, series_name);
            }
        }
        if(result != undefined) {
            res.status(200).send({
                message: "create success",
            });
        }else {
            res.status(405).send({
                message: "create failed"
            });
        }
    //토큰 검증이 실패할 경우
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});
module.exports = router;
