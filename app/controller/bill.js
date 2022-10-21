'use strict';
const moment = require('moment');

const Controller = require('egg').Controller;

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;

    // 判空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secrit);

      if (!decode) return;
      const user_id = decode.id;
      await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }

  }

  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      // 通过 token 解析，拿到 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;

      const user_id = decode.id;

      // 1.该用户所有的账单数据
      const list = await ctx.service.bill.list(user_id);

      // 2.返回筛选条件下的数据
      const _list = list.filter(item => {
        if (type_id !== 'all') {
          // 根据类型和时间（当月）筛选数据
          return moment(Number(item.date)).format('YYYY-MM') === date && type_id === item.type_id;
        }
        // 返回当月所有的数据
        return moment(Number(item.date)).format('YYYY-MM') === date;
      });

      // 3.格式化数据，变成前端需要的格式
      const listMap = _list.reduce((curr, item) => {

        const date = moment(Number(item.date)).format('YYYY-MM-DD');
        // 日期相同的放到同一个数组bills中
        if (curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
          const index = curr.findIndex(item => item.date === date);
          curr[index].bills.push(item);
        }
        // 如果是不同的日期，新建一个数组
        if (curr && curr.length && curr.findIndex(item => item.date === date) === -1) {
          curr.push({
            date,
            bills: [ item ],
          });
        }

        // 如果 curr 为空数组，则默认添加第一个账单项 item
        if (!curr.length) {
          curr.push({
            date,
            bills: [ item ],
          });
        }

        return curr;
      }, []).sort((a, b) => moment(b.date) - moment(a.date));

      // 4.分页处理
      const pageListMap = listMap.slice((page - 1) * page_size, page * page_size);

      // 5.计算当月总收入和支出
      // 总支出
      const totalExpense = _list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 总支出
      const totalIncome = _list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 6.返回数据
      ctx.body = {
        coe: 200,
        msg: '请求成功',
        data: {
          totalExpense, // 当月支出
          totalIncome, // 当月收入
          totalPage: Math.ceil(listMap.length / page_size), // 总分页
          list: pageListMap || [], // 格式化后，并且经过分页处理的数据
        },
      };

    } catch (e) {
      console.log(e);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  async detail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    const token = ctx.request.header.authorization;
    // 获取当前用户信息
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;

    if (!id) {
      ctx.body = {
        code: 500,
        msg: 'id不存在',
        data: null,
      };
      return;
    }

    try {
      // 从数据库中获取账单详情
      const result = await ctx.service.bill.detail(user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: result,
      };

    } catch {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }

  }
}

module.exports = BillController;
