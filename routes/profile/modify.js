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

var multiUpload = upload.fields([{ name: 'profile_photo'}, { name: 'background_Image'}])
router.post('/', multiUpload, async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let readProfile = 'select * from Profiles where ID = ?';
    let updateProfile = 'update Profiles set ? where ID = ?';
    if (ID != -1) {
        let profileExist = await db.execute(readProfile, ID);
        if (profileExist.length === 0)
            res.status(403).send({
                message: 'profile does not exist'
            });
        else {
            let data = {
                profile_photo: req.files.profile_photo ? req.files.profile_photo[0].location : profileExist[0].profile_photo,
                name: req.body.name ? req.body.name : profileExist[0].name,
                jobs: req.body.jobs ? req.body.jobs : profileExist[0].jobs,
                birth: req.body.birth ? req.body.birth : profileExist[0].birth,
                tel: req.body.tel ? req.body.tel : profileExist[0].tel,
                active_Area: req.body.active_Area ? req.body.active_Area : profileExist[0].active_Area,
                condition_message: req.body.condition_message ? req.body.condition_message : profileExist[0].condition_message,
                awards: req.body.awards ? req.body.awards : profileExist[0].awards,
                gender: req.body.gender ? req.body.gender : profileExist[0].gender,
                email: req.body.page ? req.body.page : profileExist[0].email,
                background_Image: req.files.background_Image ? req.files.background_Image[0].location : profileExist[0].background_Image
            };
            let result = await db.execute3(updateProfile, data, ID);
            res.status(200).send({
                message: 'modify success'
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
