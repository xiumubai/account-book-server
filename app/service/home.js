'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async user() {
    // 假设从数据库获取的用户信息
    return {
      name: 'xiumubai',
      slogen: '朽木可雕',
    };
  }
}
module.exports = HomeService;
