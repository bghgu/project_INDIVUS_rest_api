const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let result = [];
    let data;

    if(ID != -1){
      let viewFavorits = 'select * from Favorits where ID = ?';
      let viewFavoritsKeycards = 'select * from FavoritsKeycards where ID = ?';

      data = await db.execute(viewFavorits, ID);

      for(let i=0; i<data.length; i++)
      {
        result.push(data[i]);
      }

      data = await db.execute(viewFavoritsKeycards, ID);

      for(let i=0; i<data.length; i++)
      {
        result.push(data[i]);
      }

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
