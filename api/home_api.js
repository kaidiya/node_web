// homeApi.js
var models = require('../config/db_conf') // 引入db配置
var express = require('express') // express框架
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../mysql/sqlmap') // sql语句

var fs = require("fs"); // 暂时没用到
var path = require('path'); // 暂时没用到

// 连接数据库
// var conn = mysql.createConnection(models.mysql)
// conn.connect()

var conn;
//******，下面这段代码主要是为了解决数据一段时间不操作之后出现 reade ECONNRESET 错误，在网上百度了一下这个错，又说是node版本不对，要回退版本，没有这样操作
function handleError() {
  // 创建一个mysql连接对象
  conn = mysql.createConnection(models.mysql)

  // 连接错误，2秒重试
  conn.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleError, 2000);
    }
  });
  // 监听错误
  conn.on('error', function (err) {
    console.log('db error', err);
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleError();
    } else {
      throw err;
    }
  });
}
handleError();

// function query() {
//   console.log(new Date());
//   var sql = "show variables like 'wait_timeout'";
//   conn.query(sql, function (err, res) {
//     console.log(res);
//   });
// }

// query();
// setInterval(query, 15 * 1000);
//********

var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json({
      code: '0',
      msg: '操作成功'
    })
  }
}

//这是对查询一个简单的封装，因为后面还会用到
var searchResult = function (callback) {
  var sql = $sql.home.search
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      callback(result)
    }
  })
}

// 查询列表接口，
// get接口，这里配置的/getlist,使用的时候就是 /home/getlist
// 回看index.js 中 app.use('/home', homeApi) ，就懂了

router.get('/nodetest/getlist', (req, res) => {

  // var sql = $sql.home.search
  var parms = req.query
  // conn.query(sql, function (err, result) {
  //     if (err) {
  //         console.log(err)
  //     }
  //     if (result) {
  //         console.log(result)
  //         res.send(result)
  //     }
  // })
  searchResult(function (result) {
    res.send({data: result, errorno: 0})
  })
})

// 新增列表
router.post('/adduser', (req, res) => {
  const sql = $sql.home.add
  const params = req.body
  const {name, sex, age} = params || {};
  const currentTime = new Date();
  const year = currentTime.getFullYear();
  const month = currentTime.getMonth() + 1;
  const date = currentTime.getDate();
  const hours = currentTime.getHours();
  let miniutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  miniutes = miniutes < 10 ? `0${miniutes}` : miniutes;
  console.log(params)
  conn.query(sql, [`${Math.floor(currentTime.getTime() / 10000)}`, name, age, sex, `${year}-${month}-${date} ${hours}:${miniutes}:${seconds}`], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

//删除指定的数据记录
router.post('/deluser', (req, res) => {

  const sql = $sql.home.delete
  const params = req.body
  searchResult(function (serresult) {
    console.log(222222222, params, serresult);
    for (let i = 0; i < serresult.length; i++) {
      console.log(33333333333, serresult[i].id, params.id, serresult[i].id == params.id);
      if (serresult[i].id == params.id) {
        conn.query(sql, [params.id], function (err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            jsonWrite(res, result)
          }
        })
      } else if (i == serresult.length - 1) {
        res.json({
          code: '1',
          msg: 'id不存在'
        })
      }
    }
  })

})

//更新数据
router.post('/edituser', (req, res) => {
  const sql = $sql.home.updata;
  const params = req.body;
  const {id, name, age, sex} = params;
  conn.query(sql, [name, age, sex, id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

// 新增留言
router.post('/addMessagelist', (req, res) => {
  var sql = $sql.message.add
  var parms = req.body
  console.log(parms)
  conn.query(sql, [parms.title, parms.content, parms.phone, parms.qq], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

router.get('/getMessagelist', (req, res) => {

  var sql = $sql.message.search
  var parms = req.query
  if (!parms.id) {
    sql = $sql.message.searchall
  }

  console.log(parms)
  conn.query(sql, [parms.id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      console.log(result)
      res.send(result)
    }
  })

})

//回复留言
router.post('/reMessagelist', (req, res) => {
  var sql = $sql.message.rep
  var parms = req.body
  console.log(parms)
  conn.query(sql, [parms.replay, parms.id], function (err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

module.exports = router