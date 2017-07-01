// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//컬렉션 조회
const view = require('./view');
router.use('/view', view);
//컬렉션 생성
const write = require('./new');
router.use('/new', write);
//컬렉션 삭제
const del = require('./delete');
router.use('/delete', del);

module.exports = router;
