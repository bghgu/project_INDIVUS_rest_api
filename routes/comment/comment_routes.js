// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//댓글 조회
const view = require('./view');
router.use('/view', view);
//댓글 작성
const write = require('./write');
router.use('/write', write);
//댓글 삭제
const del = require('./delete');
router.use('/delete', del);
//댓글 수정
const modify = require('./modify');
router.use('/modify', modify);

module.exports = router;
