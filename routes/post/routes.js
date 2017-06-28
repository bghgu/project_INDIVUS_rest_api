// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//글쓰기
const write = require('./write');
router.use('/write', write);
//글 삭제
const del = require('./delete');
router.use('/delete', del);

module.exports = router;
