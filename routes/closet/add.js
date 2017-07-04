const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

//Closet에서 추가 버튼을 누르면 카테고리와 키카드를 보여주는 창
router.get('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let result = [];
    let data;

    if(ID != -1){
      let viewCategory = 'select * from Categorys';
      let viewKeycard = 'select * from Keycards';

      data = await db.execute(viewCategory, ID);

      for(let i=0; i<data.length; i++)
      {
        result.push(data[i]);
      }

      data = await db.execute(viewKeycard, ID);

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


//원하는 카테고리와 키카드 선택해서 추가
router.post('/', async(req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    let c_id = req.body.category_id;
    let k_id = req.body.keycard_id;
    let data, data2;
    let result, result2;

    if(ID != -1){
      let addCategory = 'insert into Favorits set ?';
      let addKeycard = 'insert into FavoritsKeycards set ?';

      if(c_id != undefined && k_id != undefined)
      {
        for(let i=0; i<c_id.length; i++)
        {
          data = {
              ID: ID,
              category_id: c_id[i]
          };
          result = await db.execute(addCategory, data);
        }

        for(let i=0; i<k_id.length; i++)
        {
          data2 = {
              ID: ID,
              keycard_id: k_id[i]
          };
          result2 = await db.execute(addKeycard, data2);
        }

      }
      else if(c_id != undefined && k_id == undefined)
      {
        for(let i=0; i<c_id.length; i++)
        {
          data = {
              ID: ID,
              category_id: c_id[i]
          };
          result = await db.execute(addCategory, data);
        }

      }
      else if(k_id != undefined && c_id == undefined)
      {
        for(let i=0; i<k_id.length; i++)
        {
          data2 = {
              ID: ID,
              keycard_id: k_id[i]
          };
          result2 = await db.execute(addKeycard, data2);
        }
      }

      if(result != undefined) {
          res.status(200).send({
              message: "closet add success"
          });
      }
      else if(result2 != undefined)
      {
          res.status(200).send({
              message: "closet add success"
          });
      }
      else {
          res.status(405).send({
              message: "closet add failed"
          });
      }
    }
    else {
        res.status(401).send({
            message : "access denied"
        });
    }

});

module.exports = router;
