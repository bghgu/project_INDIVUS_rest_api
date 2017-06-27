// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

const signup = require('./signup');
router.use('/signup', signup);

const login = require('./login');
router.use('/login', login);

module.exports = router;
