// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//팔로잉
const following = require('./following/following_routes');
router.use('/following', following);

//팔로워
const follower = require('./follower/follower_routes');
router.use('/follower', follower);

//팔로우 추가
const follow = require('./follow');
router.use('/follow', follow);

module.exports = router;
