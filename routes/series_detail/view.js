const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const seriesName = req.body.series_name;

    if(ID != -1){
      let viewSeriesDetail = 'select * from Posts where content_type = 1 and title = ? and ID_creator = ?';
      let result = await db.execute3(viewSeriesDetail, seriesName, ID);

      res.status(200).send({
          result
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }
});


router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);

    if(ID != -1){
      let viewSeriesDetail = 'select * from Posts where content_type = 0 and ID_creator = ?';
      let result = await db.execute(viewSeriesDetail, ID);

      res.status(200).send({
          result
      });
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
