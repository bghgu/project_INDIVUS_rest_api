const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

/*
포스팅 작성 완료시 시리즈에 포스트 ID 추가
단편 포스트일 경우 디폴트 포스트에 ID 추가
*/

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const post_id = req.body.post_id;
    const content_type = req.body.content_type;
    const series_name = req.body.title;
    let insertSeries = 'update Series set post_id = ? where ID_creator = ? and series_name = ?';
    let insertDefault = 'insert into DefaultSeries set ?';
    let result;
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        //단편일 경우
        if(content_type == 0) {
            let data = {
                ID_creator: ID,
                post_id : post_id
            };
            result = await db.execute(insertDefault, data);
            console.log(result);
        }
        //시리즈일 경우
        else {
            let data = {
                ID_creator: ID,
                post_id : post_id,
                series_name : series_name
            };
            result = await db.execute4(insertSeries, post_id, ID, series_name);

            //if(result.message);
        }
        if(result != undefined) {
            res.status(200).send({
                message: "create success"
            });
        }else {
            res.status(405).send({
                message: "create failed"
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
