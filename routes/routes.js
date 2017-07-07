// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

//유저 관련
const user = require('./user/user_routes');
router.use('/', user);

//프로필
const profile = require('./profile/profile_routes');
router.use('/profile', profile);

//큐레이션
const curation = require('./curation/curation_routes');
router.use('/', curation);

//게시글 관련 라우팅 연결
const post = require('./post/post_routes');
router.use('/post', post);

//팔로잉 & 팔로워
const friends = require('./friends/friends_routes');
router.use('/friends', friends);

//검색
const search = require('./search/search_routes');
router.use('/search', search);

//좋아요
const like = require('./like/like_routes');
router.use('/like', like);

//댓글
const comment = require('./comment/comment_routes');
router.use('/comment', comment);

//대댓글
const comment_detail = require('./comment_detail/comment_detail_routes');
router.use('/comment-detail', comment_detail);

//컬렉션
const collection = require('./collection/collection_routes');
router.use('/collection', collection);

//컬렉션 상세
const collection_detail = require('./collection_detail/collection_detail_routes');
router.use('/collection-detail', collection_detail);

//시리즈(워크룸)
const series = require('./series/series_routes');
router.use('/series', series);

//시리즈 상세
const series_detail = require('./series_detail/series_detail_routes');
router.use('/series-detail', series_detail);

//클로젯
const closet = require('./closet/closet_routes');
router.use('/closet', closet);

//카테고리 & 키카드 목록 조회
const list = require('./list/list_routes');
router.use('/list', list);

//알람
const notice = require('./notice/notice_routes');
router.use('/notice', notice);

module.exports = router;
