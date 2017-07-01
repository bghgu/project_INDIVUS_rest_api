// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//카테고리 기반
const category_feed = require('./category_feed');
router.use('/category-feed', category_feed);

//팔로우 기반
const follow_feed = require('./follow_feed');
router.use('/follow-feed', follow_feed);

module.exports = router;
