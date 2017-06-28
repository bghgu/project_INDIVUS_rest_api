const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey').key;
module.exports = {
    //jwt 발급후 토큰 리턴
    sign : function(ID) {
        const options = {
            algorithm : "HS256",
            expiresIn : 60 * 60 * 24 * 30 //30 days
        };
        const payload = {
            user_id : ID
        };
        let token = jwt.sign(payload, secretKey, options);
        return token;
    },
    //jwt 발급후 사용자 정보 리턴
    verify : function(token) {
        const decoded = jwt.verify(token, secretKey);
        if(!decoded) {
            return -1;
        }else {
            return decoded.user_id;
        }
    }
};
