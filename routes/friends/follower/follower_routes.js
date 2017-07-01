// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//팔로워 리스트
const list = require('./list');
router.use('/list', list);

module.exports = router;
