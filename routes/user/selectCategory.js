const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const category = 'select * from Categorys order by category_like DESC';
    let result = await db.FindAll(category);
    res.status(200).send({result});
});

router.post('/', async(req, res, next) => {
    const id = req.body.id;
    const categories = req.body.categories;
    const select = 'insert into Favorits set ?';
    let result;
    for (i = 0; i < categories.length; i++) {
        let data = {
            ID: id,
            category_id: categories[i],
        };
        result = await db.execute(select, data);
    }
    if (result != undefined) {
        res.status(201).send({message: 'success'});
    } else {
        res.status(405).send({message: 'fail'});
    }
});

module.exports = router;
