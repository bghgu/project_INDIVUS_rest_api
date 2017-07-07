// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//글쓰기
const write = require('./write');
router.use('/write', write);
//글 삭제
const del = require('./delete');
router.use('/delete', del);
//글 조회
const view = require('./view');
router.use('/view', view);
//이전화
const past_post = require('./past_post');
router.use('/past-post', past_post);
//다음화
const next_post = require('./next_post');
router.use('/next-post', next_post);
//시리즈 보기
const view_series = require('./view_series');
router.use('/view-series', view_series);

module.exports = router;
