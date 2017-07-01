// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//포스트 좋아요
const like = require('./like');
router.use('/like', like);

module.exports = router;
