const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.post('/', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const seriesName = req.body.series_name;

    if(ID != -1){
      let readSeries = 'select * from Series where series_name = ? and ID_creator = ?';
      let seriesExist = await db.execute3(readSeries, seriesName, ID);

      console.log(seriesExist);
      if(seriesExist.length===0)
          res.status(404).send({message: 'series does not exist'});
      else{
          let deleteSeries = 'delete from Series where series_name = ? and ID_creator = ?';
          let result = await db.execute3(deleteSeries, seriesName, ID);
          res.status(200).send({message: 'series delete success'});
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
