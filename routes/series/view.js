const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let viewWorkroom = 'select s.*, p.card_cover from Series s join Posts p on s.post_id=p.post_id where s.ID_creator = ?';
    let viewWorkroom3 = 'select * from Series where post_id is null and ID_creator = ?';
    let series = 'select count(*) as count from Posts where title = ? and ID_creator = ?';
    let viewWorkroom2 = 'select count(*) as count from DefaultSeries where ID_creator = ?';
    let DefaultSeries = 'select post_id from DefaultSeries where ID_creator = ? limit 1';
    let post = 'select card_cover from Posts where post_id = ?';
    if (ID != -1) {
        let result = await db.execute(viewWorkroom, ID);
        let result4 = await db.execute(viewWorkroom3, ID);
        for (i = 0; i < result.length; i++) {
            let result2 = await db.execute3(series, result[i].series_name, result[i].ID_creator);
            result[i].series_counts = result2[0].count;
        }
        for (i = 0; i < result4.length; i++){
            result4[i].card_cover = null;
            result4[i].series_counts = null;
            result.push(result4[i]);
        }
        let result3 = await db.execute(viewWorkroom2, ID);
        let post_id = await db.execute(DefaultSeries, ID);
        let card_cover = await db.execute(post, post_id[0].post_id);
        let data = {
            post_id : 0,
            ID_creator : ID,
            series_name : "단편",
            card_cover : card_cover[0].card_cover,
            series_counts : result3[0].count
        };
        result.push(data);
        res.status(200).send({
            result
        });
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }
});

module.exports = router;
