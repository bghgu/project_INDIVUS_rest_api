// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//클로젯 조회
const view = require('./view');
router.use('/view', view);

//클로젯에 카테고리 추가
const add = require('./add');
router.use('/add', add);

module.exports = router;
