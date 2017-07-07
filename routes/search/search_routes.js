// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//제목 검색
const title_search = require('./title_search');
router.use('/title-search', title_search);

//제작자 검색
const creator_search = require('./creator_search');
router.use('/creator-search', creator_search);

module.exports = router;
