'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    // 假设从数据库获取的用户信息
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`;
    console.log('sql=-===========', sql);
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addUser(name) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('list', { name });
      return result;

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editUser(id, name) {
    const { app } = this;
    try {
      const result = await app.mysql.update('list', { name }, {
        where: {
          id,
        },
      });
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async deleteUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = HomeService;
