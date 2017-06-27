const express = require('express');
const router = express.Router();
const pool = require('../config/dbPool');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: '',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now() + '.' + file.originalname.split('.').pop());
    }
  })
});

/* 기본 CRUD API 예제 */
/* 사용자 정보를 CRUD하는 예제입니다. */
/* 데이터베이스 내 user 테이블에는 기본키(userId), 사용자이름(userName), 사용자의 이미지(userImage)
   이렇게 3가지 필드가 정의되어 있다고 가정합니다.
   1. userId: 기본키, auto-increment, int타입
   2. userName: not null(null값 불허), unique(중복값 불허), varchar타입
   3. userImage: 이미지url, null값 허용, TEXT타입
/* async-await로 비동기 처리 */


/* 서버에서 요청을 처리하기 전에는 요청 값에 대한 예외 처리가 반드시 필요합니다.
    1. 요청 값의 타입이 적절한지
    2. GET/PUT/DELETE 로 요청한 값과 관련된 자원(user)이 DB에 존재하는지
    3. 서버에서 null입력을 허용하지 않음에도 POST/PUT 요청 값 중에 null이 있지 않은지
    4. unique 옵션을 걸어놓은 필드에 대해 중복되는 값이 들어오지는 않는지
  아래 api들은 위 세 가지 예외처리를 적용한 것들 입니다. */


/* 예외 처리를 하다보면 중복되는 코드가 많아지기 때문에 클래스 메소드로 만들거나,
   다른 미들웨어에서 처리하는 방법을 찾아보는 것도 좋습니다.. */





/* 모든 사용자의 userId와 userName을 조회(read)하는 api 입니다. */
router.get('/', async (req, res, next) => {
    try{
       var connection = await pool.getConnection(); // var, let의 차이는 1차세미나 자료를 참고하세요.
       let readAll = 'select userId, userName from user';
       let users = await connection.query(readAll);
       /* 요청을 정상적으로 수행하고 요청 결과를 json 객체로 전달합니다.
          쿼리 결과는 객체배열에 담겨집니다. 여러 명의 사용자 정보가 객체형태로 배열에 담겨지고, 이를 전달합니다.*/
       res.status(200).send({result: users});
    }
    catch(err){
        next(err); //수행 도중 에러가 발생하면 app.js에 있는 미들웨어로 에러를 전달합니다.
    }
    finally{
        /* 커낵션 객체 사용 후에는 무조건 pool에 객체를 반납해야 하므로 finally구문에서 객체를 release합니다.*/
        pool.releaseConnection(connection);
    }
});






/* 식별자(기본키)가 userId인 사용자의 userId, userName, userImage를 조회하는 api입니다. */
/* 특정한 자원(user)하나만을 조회/수정/삭제 할 경우에는 그 자원(user)의 기본키(숫자, userId)로 자원을 구분합니다.*/
router.get('/:userId', async (req, res, next) => {
    try{
        let reqUserId = req.params.userId;
        var connection = await pool.getConnection();
        let readUser = 'select * from user where userId = ?';
        let user = await connection.query(readUser, reqUserId);
            /* DB에 요청한 userId가 존재하지 않으면(없는 사용자의 정보를 요청한다면) */
        if(user.length===0)
            res.status(404).send({message: 'user does not exist'}); //없는 자원을 요청했으므로 404로 응답합니다.
        else
                /* 쿼리 결과는 객체배열에 담겨집니다.
                   한 명의 정보만을 요청했으므로 배열 그대로가 아닌 객체 한 개를 가져와 응답합니다. */
            res.status(200).send({result: user[0]});

    }
    catch(err){
        next(err);
    }
    finally{
        /* 커낵션 객체 사용 후에는 무조건 pool에 객체를 반납해야 하므로 finally구문에서 객체를 release합니다.*/
        pool.releaseConnection(connection);
    }
});






/* 새로운 사용자 정보를 저장하는 api */
router.post('/', upload.single('profile'), async (req, res, next) => {
    try{
        let body = req.body;
        /* 사용자 이름이 null이거나 string이 아니라면 */
        if(!body.userName)
            res.status(400).send('userName cannot be null');
        else if (typeof body.userName != 'string')
            res.status(400).send({message: 'wrong type of userName: ' + typeof body.userName});
        else{
            var connection = await pool.getConnection();
            /* userName은 unique 해야하므로 입력한 userName이 중복되는지 확인합니다.*/
            let checkUserName = 'select userName from user where userName = ?';
            let dupName = await connection.query(checkUserName, body.userName);
            if(dupName.length!==0) res.status(405).send({message: 'username already exists'}); //중복되는 사용자이름을 사용할 수 없으므로 405로 응답합니다.
            else{
                let insertNewUser = 'insert into user set ?';
                let newUser = {
                    userName: body.userName,
                    userImage: req.file ? req.file.location : null //요청 값에 파일이 있으면 파일의 주소를, 그렇지 않으면 null.
                };
                //query메소드는 쿼리가 실행되고 나면 새로 삽입된 테이블의 상태들을 값으로 갖는 객체를 반환합니다.
                //insertId 키는 새로 삽입된 레코드의 기본키를 값으로 가지므로 post가 정상적으로 실행되고 나면
                //새로 삽입된 레코드의 기본키를 전달합니다.
                let inserted = await connection.query(insertNewUser, newUser);
                console.log(inserted);
                res.status(201).send({result: inserted.insertId});
            }

        }
    }
    catch(err){
        next(err);
    }
    finally{
        /* 커낵션 객체 사용 후에는 무조건 pool에 객체를 반납해야 하므로 finally구문에서 객체를 release합니다.*/
        pool.releaseConnection(connection);
    }
});






/* 사용자 정보를 수정하는 api */
router.put('/:userId', upload.single('profile'), async (req, res, next) => {
    try{
        let reqUserId = req.params.userId;
        let body = req.body;
        /* 사용자이름은 null을 허용하지 않으므로 userName이 null이 아닌지, null이 아니라면 string타입이 맞는지 확인합니다 */
        if(!body.username)
             res.status(400).send({message: 'userName cannot be null'});
        else if(typeof body.userName != 'string')
             res.status(400).send({message: 'wrong type of userName : ' + typeof userName});
        else {
            var connection = await pool.getConnection();
            let readUser = 'select * from user where userId = ?';
            let userExist = await connection.query(readUser, reqUserId);
            /* DB에 요청한 userId가 존재하지 않으면(없는 사용자의 정보를 요청한다면) */
            if(userExist.length===0)
                res.status(404).send({message: 'user does not exist'});
            else {
                /* userName은 unique 해야하므로 입력한 userName이 중복되는지 확인합니다.*/
                let checkUserName = 'select userName, userId from user where userName = ?';
                let userChecked = await connection.query(checkUserName, body.userName);
                //중복되는 사용자이름을 사용할 수 없으므로 405로 응답합니다.
                if(userChecked.length !==0 && userChecked[0].userId!==reqUserId) res.status(405).send({message: 'username already exists'});
                else{
                    let imageUrl = req.file ? req.file.location : null;
                    let editUser = 'update user set userName = ?, userImage = ? where userId = ?';
                    await connection.query(editUser, [body.userName, imageUrl, reqUserId]);
                    res.status(200).send({message: 'edit success'});
                }
            }
        }
    }
    catch(err){
        next(err);
    }
    finally{
        /* 커낵션 객체 사용 후에는 무조건 pool에 객체를 반납해야 하므로 finally구문에서 객체를 release합니다.*/
        pool.releaseConnection(connection);
    }
});




router.delete('/:userId', async (req, res, next) => {
    try{
        let reqUserId = req.params.userId;
        var connection = await pool.getConnection();
        let readUser = 'select * from user where userId = ?';
        let userExist = await connection.query(readUser, reqUserId);
        /* DB에 요청한 userId가 존재하지 않으면(없는 사용자의 정보를 요청한다면) */
        if(userExist.length===0)
            res.status(404).send({message: 'user does not exist'});
        else{
            let deleteUser = 'delete from user where userId = ?';
            await connection.query(deleteUser, reqUserId);
            res.status(200).send({message: 'delete success'});
        }
    }catch(err){
        next(err);
    }finally{
        pool.releaseConnection(connection);
    }
});



module.exports = router;
