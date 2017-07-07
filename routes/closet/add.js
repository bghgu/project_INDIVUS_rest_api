const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
const aws = require('aws-sdk');
aws.config.loadFromPath('./config/awsConfig.json');
//aws.config.loadFromPath('../config/awsConfig.json');
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

//Closet에서 추가 버튼을 누르면 카테고리와 키카드를 보여주는 창
router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let result = [];
    let data;

    if (ID != -1) {
        let viewCategory = 'select category_id as card_id, category_name as card_name, category_like as card_like, category_image as image from Categorys where category_id not in (select category_id from Favorits where ID = ?)';
        let viewKeycard = 'select keycard_id as card_id, keycard_name as card_name, like_counts as card_like, keycard_image as image from Keycards where keycard_id not in (select keycard_id from FavoritsKeycards where ID = ?)';

        data1 = await db.execute(viewCategory, ID);

        for (let i = 0; i < data1.length; i++) {
            data = {
                type: "category",
                card_id: data1[i].card_id,
                card_name: data1[i].card_name,
                card_like: data1[i].card_like,
                image: data1[i].image
            };
            result.push(data);
        }

        data2 = await db.execute(viewKeycard, ID);

        for (let i = 0; i < data2.length; i++) {
            data = {
                type: "keycard",
                card_id: data2[i].card_id,
                card_name: data2[i].card_name,
                card_like: data2[i].card_like,
                image: data2[i].image
            };
            result.push(data);
        }

        if (result.length != 0) {
            res.status(200).send({
                result
            });
        } else {
            res.status(405).send({
                message: "no lists"
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});


//원하는 카테고리와 키카드 선택해서 추가
router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let c_id = req.body.category_id;
    let k_id = req.body.keycard_id;
    let data, data2;
    let result, result2;

    if (ID != -1) {
        let addCategory = 'insert into Favorits set ?';
        let addKeycard = 'insert into FavoritsKeycards set ?';

        if (c_id != undefined && k_id != undefined) {
            for (let i = 0; i < c_id.length; i++) {
                data = {
                    ID: ID,
                    category_id: c_id[i]
                };
                result = await db.execute(addCategory, data);
            }

            for (let i = 0; i < k_id.length; i++) {
                data2 = {
                    ID: ID,
                    keycard_id: k_id[i]
                };
                result2 = await db.execute(addKeycard, data2);
            }

        } else if (c_id != undefined && k_id == undefined) {
            for (let i = 0; i < c_id.length; i++) {
                data = {
                    ID: ID,
                    category_id: c_id[i]
                };
                result = await db.execute(addCategory, data);
            }

        } else if (k_id != undefined && c_id == undefined) {
            for (let i = 0; i < k_id.length; i++) {
                data2 = {
                    ID: ID,
                    keycard_id: k_id[i]
                };
                result2 = await db.execute(addKeycard, data2);
            }
        }

        if (result != undefined) {
            res.status(200).send({
                message: "closet add success"
            });
        } else if (result2 != undefined) {
            res.status(200).send({
                message: "closet add success"
            });
        } else {
            res.status(405).send({
                message: "closet add failed"
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }

});

//키카드 새로 생성
router.post('/plus', upload.single('keycard_image'), async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const keycardName = req.body.keycard_name;
    var imageUrl;
    if (!req.file) {
        imageUrl = null;
    } else {
        imageUrl = req.file.location;
    }

    if (ID != -1) {
        let plusKeycard= "insert into Keycards set ?";

        let data = {
            keycard_name : keycardName,
            keycard_image : imageUrl
        }

        let checkName = 'select keycard_name from Keycards where keycard_name = ?';
        let dupName = await db.execute(checkName, keycardName);

        if (dupName.length !== 0) {
            res.status(405).send({
                message: 'keycard name already exists'
            });
        } else {
            let result = await db.execute(plusKeycard, data);

            res.status(200).send({
                message : "new keycard create success"
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
