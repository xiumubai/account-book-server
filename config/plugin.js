'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  /**
   * egg-mysql插件
   */
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  /**
   * 鉴权插件
   */
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },

};
