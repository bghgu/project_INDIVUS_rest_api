// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//회원가입
const signup = require('./signup');
router.use('/signup', signup);
//로그인
const login = require('./login');
router.use('/login', login);

//카테고리 선택
const selectCategory = require('./selectCategory');
router.use('/selectCategory', selectCategory);

module.exports = router;
