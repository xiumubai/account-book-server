'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    // 从 bill 表中查询 user_id 等于当前用户 id 的账单数据，并且返回的属性是 id, pay_type, amount, date, type_id, type_name, remark
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = app.mysql.query(sql);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = BillService;