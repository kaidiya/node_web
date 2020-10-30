var mysql = require('mysql');
//连接数据库
var connection = mysql.createConnection({
  host: '10.188.41.7',
  user: 'root',  //用户名
  password: 'q,s9ylH-gwig',   //密码
  database: 'node_test',
  port: '3306'     //端口号
});
connection.connect(function (err) {
  if (err) {
    console.log('---:' + err);
    return;
  }
  console.log('连接succeed');
});
// 插入一条数据
var sql = 'DELETE FROM userlist WHERE id=?';
var param = [3];
connection.query(sql, param, function (err, rs) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('插入数据succeed');
});
//执行查询 查询study数据库中的userlist表的数据
connection.query('select * from userlist', function (err, rs) {
  if (err) {
    console.log(err);
    return;
  }
  for (var i = 0; i < rs.length; i++) {
    console.log('id:' + rs[i].id + 'name:' + rs[i].name + 'age:' + rs[i].age + 'sex:' + rs[i].sex + 'create_time:' + rs[i].create_time);
  }
});
//关闭数据库
connection.end(function (err) {
  if (err) {
    console.log('---:' + err);
    return;
  }
  console.log('关闭succeed');
})
