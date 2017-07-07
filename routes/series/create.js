const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

/*
시리즈 +버튼 누를시 새로운 시리즈 추가
*/

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const series_name = req.body.series_name;
    let check = 'select series_name from Series where series_name = ?';
    let insertSeries = 'insert into Series set ?';
    //토큰 검증이 성공할 경우
    if (ID != -1) {
        let checkresult = await db.execute(check, series_name);
        if(checkresult.length == 0) {
            let data = {
                ID_creator: ID,
                series_name : series_name
            };
            console.log(data);
            let result = await db.execute(insertSeries, data);
            console.log(result);
            if(result != undefined) {
                res.status(200).send({
                    message: "create success"
                });
            }else {
                res.status(405).send({
                    message: "create failed"
                });
            }
        }else {
            res.status(405).send({
                message: "exist series_name"
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
