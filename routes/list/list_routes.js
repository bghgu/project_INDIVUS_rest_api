// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//카테고리 리스트 조회
const category_list = require('./category_list');
router.use('/category-list', category_list);

//키카드 리스트 조회
const keycard_list = require('./keycard_list');
router.use('/keycard-list', keycard_list);

//키카드 추가
const keycard_add = require('./keycard_add');
router.use('/keycard-add', keycard_add);

module.exports = router;
