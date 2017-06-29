//const bcrypt = require('bcrypt'); //확장모듈
const saltRounds = 10;

module.exports = {
    encoding: function(password) {
        //암호화
        let result;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) {
                result = err;
            } else {
                result = hash;
                console.log(result);
            }
        });
        return result;
    },
    compare: function(req_password, data_password) {
        //해쉬 비교
        let result;
        bcrypt.compare(req_password, data_password, function(err, result) {
            if (err) {
                result = err;
            } else {
                if (data) {
                    result = data;
                    console.log(result);
                } else {
                    console.log(result);
                }
            }
        });
        return 1;
    }

};
