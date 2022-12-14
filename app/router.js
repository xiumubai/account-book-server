'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串
  /** 增删改查测试接口 */
  router.get('/', controller.home.index);
  router.get('/user', controller.home.user);
  router.post('/addUser', controller.home.addUser);
  router.post('/edit_user', controller.home.editUser);
  router.post('/delete_user', controller.home.deleteUser);
  /** 注册 */
  router.post('/api/user/register', controller.user.register);
  /** 登陆 */
  router.post('/api/user/login', controller.user.login);
  /** 测试token */
  router.get('/api/user/test', _jwt, controller.user.test);
  /** 获取用户信息 */
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  /** 修改用户信息 */
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);
  /** 上传图片 */
  router.post('/api/upload', controller.upload.upload);
  /** 获取消费类型列表 */
  router.get('/api/type/list', _jwt, controller.type.list);
  /** 添加账单 */
  router.post('/api/bill/add', _jwt, controller.bill.add);
  /** 账单列表 */
  router.get('/api/bill/list', _jwt, controller.bill.list);
  /** 账单详情 */
  router.get('/api/bill/detail', _jwt, controller.bill.detail);
  /** 修改账单 */
  router.post('/api/bill/update', _jwt, controller.bill.update);
  /** 删除账单 */
  router.post('/api/bill/delete', _jwt, controller.bill.delete); // 删除账单
  /** 统计数据 */
  router.get('/api/bill/data', _jwt, controller.bill.data);
};
