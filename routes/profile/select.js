const express = require('express');
const router = express.Router();
const async = require('async');
const pool = require('../../config/db_pool.js');


router.get('/', async(req, res, next) => {
    try{
      var connection = await pool.getConnection();

      var profile = 'select * from Profiles';

      let result = await connection.query(profile);

      res.status(201).send({result: result});

    }catch (err) {
        console.log(err);
        next(err);
    } finally {
        pool.releaseConnection(connection);
    }
});

module.exports = router;
