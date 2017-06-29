// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//유저 관련
const user = require('./user/user_routes');
router.use('/', user);

//게시글 관련 라우팅 연결
const post = require('./post/post_routes');
router.use('/post', post);

//프로필
const profile = require('./profile/profile_routes');
router.use('/profile', profile);

//팔로잉 & 팔로워
const friends = require('./friends/friends_routes');
router.use('/', friends);

module.exports = router;
