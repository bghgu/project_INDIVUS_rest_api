// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//팔로잉 리스트
const list = require('./list');
router.use('/list', list);
//팔로잉 추가
const add = require('./add');
router.use('/add', add);

module.exports = router;
