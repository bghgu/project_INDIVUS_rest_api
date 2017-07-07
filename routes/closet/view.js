const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    /*
    타입 명시 : 스트링값
    Card_id : 타입의 id
    이름 : sf, 로맨스
    이미지 :
    */
    let viewFavorits = 'select c.category_id as card_id, c.category_name as card_name, c.category_image as image from Favorits f join Categorys c on f.category_id = c.category_id where ID = ?';
    let viewFavoritsKeycards = 'select k.keycard_id as card_id, k.keycard_name as card_name, k.keycard_image as image from FavoritsKeycards fk join Keycards k on fk.keycard_id = k.keycard_id where ID = ?';
    let result = [];
    let data, j = 0;
    if (ID != -1) {
        data1 = await db.execute(viewFavorits, ID);
        data2 = await db.execute(viewFavoritsKeycards, ID);
        for(i = 0; i < data1.length; i++) {
            data = {
                type : "category",
                card_id : data1[i].card_id,
                card_name : data1[i].card_name,
                image : data1[i].image
            };
            result.push(data);
        }
        for(i = 0; i < data2.length; i++) {
            data = {
                type : "keycard",
                card_id : data2[i].card_id,
                card_name : data2[i].card_name,
                image : data2[i].image
            };
            result.push(data);
        }
        if(result.length != 0) {
            res.status(200).send({
                result
            });
        }else {
            res.status(405).send({
                message: "no lists"
            });
        }
    } else {
        res.status(401).send({
            message: "access denied"
        });
    }

});

module.exports = router;
