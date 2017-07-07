// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//컬렉션 상세 조회
const view = require('./view');
router.use('/view', view);

//컬렉션 상세 삭제
const del = require('./delete');
router.use('/delete', del);

//컬렉션 상세 삭제
const add = require('./add');
router.use('/add', add);

module.exports = router;
