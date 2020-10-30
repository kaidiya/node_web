
var sqlMap = {
  // home    增 删 改 查
  home: {
    search: 'SELECT * FROM userlist', // 查询数据库的某个表的数据
    add: 'insert into userlist(id,name,age,sex,create_time) values (?,?,?,?,?)', // 向数据库的某个表插入数据
    delete: 'DELETE FROM userlist WHERE id=?', // 删除某个表的某条数据 id
    updata: 'UPDATE userlist SET name = ?,age = ?, sex = ? WHERE Id = ?' // 修改某个表的某条数据
  },
  // message 自己做了一个简单的留言和回复查询
  message: {
    add: 'insert into tb_message(titile,content,phone,qq) values (?,?,?,?)',
    search: 'SELECT * FROM tb_message WHERE id=?',
    searchall: 'SELECT * FROM tb_message',
    rep: 'UPDATE tb_message SET replay = ? WHERE id=?'
  }
}
module.exports = sqlMap;
