// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//프로필 조회
const view = require('./view');
router.use('/', view);
//프로필 삭제
const del = require('./delete');
router.use('/delete', del);
//프로필 수정
const modify = require('./modify');
router.use('/modify', modify);

module.exports = router;
