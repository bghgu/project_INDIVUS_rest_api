const async = require('async');
const db = require('../module/pool.js');

/*
알림 db 삽입
*/
let notice = 'insert into Notices set ?';
let opponent_post ='select ID_creator from Posts where post_id = ?';
let opponent_comment ='select ID from Comments where comment_id = ?';
let opponent_commentDetail ='select ID from CommentDetails where comment_detail_id = ?';
let opponent_collections = 'select ID from MyCollectionLists where collection_id = ?';
module.exports = {
    //컨텐츠에 댓글을 달았을 때
    post_comment : async (...args) => {
        const ID = args[0];
        const post_id = args[1];
        const comment_id = args[2];
        let opponent_ID = await db.execute(opponent_post, post_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID_creator,
            to_type : "Posts",
            to_id : post_id,
            from_type : "Comments",
            from_id : comment_id
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //컨텐츠에 쓴 댓글의 답글
    post_commentDetail : async (...args) => {
        const ID = args[0];
        const post_id = args[1];
        const comment_detail_id = args[2];
        let opponent_ID = await db.execute(opponent_post, post_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID_creator,
            to_type : "Posts",
            to_id : post_id,
            from_type : "CommentDetails",
            from_id : comment_detail_id
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //컨텐츠를 컬렉션에 수집
    post_collection : async (...args) => {
        const ID = args[0];
        const post_id = args[1];
        const collection_id = args[2];
        let opponent_ID = await db.execute(opponent_collections, collection_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID,
            to_type : "Posts",
            to_id : post_id,
            from_type : "Collections",
            from_id : collection_id
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //컨텐츠에 어썸 라이트
    post_like : async (...args) => {
        const ID = args[0];
        const post_id = args[1];
        let opponent_ID = await db.execute(opponent_post, post_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID_creator,
            to_type : "Posts",
            to_id : post_id,
            from_type : "PostLikes"
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //댓글에 쓴 답글
    comment_commentDetail : async (...args) => {
        const ID = args[0];
        const comment_id = args[1];
        const comment_detail_id = args[2];
        let opponent_ID = await db.execute(opponent_comment, comment_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID,
            to_type : "Comments",
            to_id : comment_id,
            from_type : "CommentDetails",
            from_id : comment_detail_id
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //댓글에 어썸라이트
    comment_like : async (...args) => {
        const ID = args[0];
        const comment_id = args[1];
        let opponent_ID = await db.execute(opponent_comment, comment_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID,
            to_type : "Comments",
            to_id : comment_id,
            from_type : "CommentLikes",
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //답글에 어썸라이트
    commentDetail_like : async (...args) => {
        const ID = args[0];
        const comment_detail_id = args[1];
        let opponent_ID = await db.execute(opponent_commentDetail, comment_detail_id);
        let data = {
            ID : ID,
            opponent_ID : opponent_ID[0].ID,
            to_type : "CommentDetails",
            to_id : comment_detail_id,
            from_type : "CommentDetailLikes"
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    },
    //팔로잉 당할 경우
    following : async (...args) => {
        const ID = args[0];
        const opponent_ID = args[1];
        let data = {
            ID : ID,
            opponent_ID : opponent_ID,
            to_type : "Following",
            to_id : opponent_ID
        };
        let result = await db.execute(notice, data);
        if(result) {
            return 1;
        }
        else {
            return -1;
        }
    }
};
