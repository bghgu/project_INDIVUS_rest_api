const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');
/*
1. 유저 2가 유저 1의 콘텐츠에 댓글을 달았을 때
- 유저 1에게 알림
유저 2님이 유저 1님의 콘텐츠에 댓글을 달았습니다.
2. 유저 2가 유저 1의 댓글에 답글을 달았을 때
- 유저 1에게 알림
유저 2님이 유저 1님의 댓글에 답글을 달았습니다.
3 유저 1의 콘텐츠에 있는 유저 2의 댓글에 유저 3이 답글을 달았을 때
- 유저 1에게 알림
유저 3님이 유저 1님의 콘텐츠에 댓글을 달았습니다.
- 유저 2에게 알림
유저 3님이 유저 2님의 댓글에 답글을 달았습니다.

4. 유저 2가 유저 1의 콘텐츠를 콜렉트했을 때
유저 2님이 유저 1님의 콘텐츠를 콜렉션에 수집했습니다.

5. 유저 2가 유저 1의 콘텐츠에 어썸 라이트를 표현했을 때
유저 2님이 유저 1님의 콘텐츠에 놀라움을 표현했습니다.

6. 유저 2가 유저 1을 팔로우하기 시작했을 때
유저 2님이 유저 1님을 팔로우하기 시작했습니다.

팔로잉 - 내가 추가한 사람
팔로워 - 나를 추가한 사람
팔로우 - 친구추가

유저2 - 상대
유저1 - 나

*/
router.get('/', async(req, res) => {
    const ID = jwt.verify(req.headers.authorization);
    const notice = 'SELECT * FROM Notices where ID = ? order by date desc';
    const opponent_profile = 'select s.username, p.profile_photo from Signup s join Profiles p on s.ID = p.ID where s.ID = ?';
    const profile = 'select username from Signup where ID = ?';
    let result = [];
    //토큰 검증이 성공할 경우
    if(ID != -1) {
        let notice_result = await db.execute(notice, ID);
        let my_username = await (db.execute(profile, ID));
        my_username = my_username[0].username;
        for(i = 0 ; i < notice_result.length; i++) {
            let person_result = await db.execute(opponent_profile, notice_result[i].opponent_ID);
            let data = {
                notice_id : notice_result[i].notice_id,
                opponent_ID : notice_result[i].opponent_ID,
                date : notice_result[i].date,
                username : person_result[0].username,
                profile_photo : person_result[0].profile_photo,
            }
            //대상이 포스트일 경우
            if(notice_result[i].to_type == "Posts") {
                //포스트에 쓴 댓글
                if(notice_result[i].from_type == "Comments") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.from_id = notice_result[i].from_id;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 컨텐츠에 댓글을 달았습니다.";
                }
                //포스트에 쓴 댓글의 답글
                else if(notice_result[i].from_type == "CommentDetails") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.from_id = notice_result[i].from_id;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 컨텐츠의 댓글에 답글을 달았습니다.";
                }
                //포스트를 컬렉션에 수집
                else if(notice_result[i].from_type == "Collections") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.from_id = notice_result[i].from_id;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 컨텐츠를 컬렉션에 수집했습니다.";
                }
                //포스트에 어썸라이트
                else if(notice_result[i].from_type == "PostLikes") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 컨텐츠에 놀라움을 표현했습니다!";
                }
            }
            //대상이 댓글일 경우
            else if(notice_result[i].to_type == "Comments") {
                //댓글에 쓴 답글
                if(notice_result[i].from_type == "CommentDetails") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.from_id = notice_result[i].from_id;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 컨텐츠의 댓글에 답글을 달았습니다.";
                }
                //댓글에 어썸라이트
                else if(notice_result[i].from_type == "CommentLikes") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 댓글에 놀라움을 표현했습니다.";
                }
            }
            //대상이 답글일 경우
            else if(notice_result[i].to_type == "CommentDetails") {
                //답글에 어썸라이트
                if(notice_result[i].from_type == "CommentDetailLikes") {
                    data.to_type = notice_result[i].to_type;
                    data.to_id = notice_result[i].to_id;
                    data.from_type = notice_result[i].from_type;
                    data.from_id = notice_result[i].from_id;
                    data.text = person_result[0].username + "님이 " + my_username + "님의 답글에 놀라움을 표현했습니다.";
                }
            }
            //팔로잉 당할 경우
            else if(notice_result[i].to_type == "Following") {
                data.to_type = notice_result[i].to_type;
                data.to_id = notice_result[i].to_id;
                data.text = person_result[0].username + "님이 " + my_username + "님을 팔로우하기 시작했습니다.";
            }
            result.push(data);
        }
        res.status(200).send({
            result
        });
    //토큰 검증이 실패할 경우
    }else {
        res.status(401).send({
            message : "access denied"
        });
    }
});

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const notice_id = req.body.notice_id;
    const delete_notice = 'delete from Notices where notice_id = ? and ID = ?';
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        let result = await db.execute3(delete_notice, notice_id, ID);
        if(result.affectedRows != 0) {
            res.status(201).send({
                message: "delete success"
            });
        }else {
            res.status(401).send({
                message: "delete failed"
            });
        }
    //토큰 검증이 실패할 경우
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
