'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串
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
};
