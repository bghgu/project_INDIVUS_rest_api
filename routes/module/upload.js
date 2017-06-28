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
//생각중
module.exports = {
    //jwt 발급후 토큰 리턴
    upload : function(image) {
        return token;
    },
};
