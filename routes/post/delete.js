const express = require('express');
const router = express.Router();
const pool = require('../../config/db_pool.js');
const async = require('async');

router.delete('/:post_id', async (req, res, next) => {
    try{
        let reqPostId = req.params.post_id;
        var connection = await pool.getConnection();
        let readPost = 'select post_id from Posts where post_id = ?';
        let postExist = await connection.query(readPost, reqPostId);
        /* DB에 요청한 userId가 존재하지 않으면(없는 사용자의 정보를 요청한다면) */
        if(postExist.length===0)
            res.status(404).send({message: 'post does not exist'});
        else{
            let deletePost = 'delete from Posts where post_id = ?';
            await connection.query(deletePost, reqPostId);
            res.status(200).send({message: 'delete success'});
        }
    }catch(err){
        next(err);
    }finally{
        pool.releaseConnection(connection);
    }
});

module.exports = router;
