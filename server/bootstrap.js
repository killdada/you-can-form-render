const { Bootstrap } = require('@midwayjs/bootstrap');
const { MidwayFrameworkService } = require('@midwayjs/core');
const { join } = require('path');

module.exports = async options => {
  // 加载框架并执行
  await Bootstrap.configure({
    appDir: __dirname,
    baseDir: join(__dirname, './dist'),
    ...options,
  }).run();
  const applicationContext = Bootstrap.getApplicationContext();
  const frameworkService = applicationContext.get(MidwayFrameworkService);
  // 返回 app 对象
  return frameworkService.getMainApp();
};
