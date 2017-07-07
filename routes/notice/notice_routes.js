// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//notice
const notice = require('./notice');
router.use('/', notice);

module.exports = router;
