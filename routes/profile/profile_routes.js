// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//프로필 조회
const select = require('./select');
router.use('/', select);

module.exports = router;
