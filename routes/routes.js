// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();
//회원가입
const signup = require('./signup');
router.use('/signup', signup);
//로그인
const login = require('./login');
router.use('/login', login);

//게시글 관련 라우팅 연결
const post = require('./post/routes');
router.use('/post', post);

//프로필
const profile = require('./profile/routes');
router.use('/profile', profile);

module.exports = router;
