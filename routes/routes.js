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

//큐레이션
const curation = require('./curation/curation_routes');
router.use('/', curation);

//검색
const search = require('./search/search_routes');
router.use('/', search);

//팔로잉 & 팔로워
const friends = require('./friends/friends_routes');
router.use('/', friends);

//좋아요
const like = require('./like/like_routes');
router.use('/', like);

//댓글
const comment = require('./comment/comment_routes');
router.use('/comment', comment);

//대댓글
const comment_detail = require('./comment_detail/comment_detail_routes');
router.use('/comment_detail', comment_detail);

//컬렉션
const collection = require('./collection/collection_routes');
router.use('/collection', collection);

//컬렉션 상세
const collection_detail = require('./collection_detail/collection_detail_routes');
router.use('/collection_detail', collection_detail);

module.exports = router;
