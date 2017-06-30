const express = require('express');
const router = express.Router();
const async = require('async');
const jwt = require('../module/jwt.js');
const db = require('../module/pool.js');

router.delete('/:comment_id', async (req, res, next) => {
    const ID = jwt.verify(req.headers.authorization);
    const commentId = req.params.comment_id;

    let readComment = 'select * from Comments where comment_id = ? and ID = ?';
    let commentExist = await db.execute3(readComment, commentId, ID);

    if(commentExist.length===0)
        res.status(404).send({message: 'comment does not exist'});
    else{
        let deleteComment = 'delete from Comments where comment_id = ?';
        let result = await db.execute(deleteComment, commentId);
        res.status(200).send({message: 'comment delete success'});
    }
});

module.exports = router;
