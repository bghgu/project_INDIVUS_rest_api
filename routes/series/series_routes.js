// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//워크룸 조회
const view = require('./view');
router.use('/view', view);

//워크룸에서 시리즈 삭제
const del = require('./delete');
router.use('/delete', del);

//시리즈테이블에 1화들 추가
const insert = require('./insert');
router.use('/insert', insert);

//시리즈 추가
const create = require('./create');
router.use('/create', create);

module.exports = router;
