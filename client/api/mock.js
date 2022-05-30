// 该服务为 vercel serve跨域处理
const { getMockData, matchMock } = require('./utils');

module.exports = (req, res) => {
  const { mockData } = getMockData({
    cwd: `../`,
  });
  const match = mockData && matchMock(req, mockData);
  console.log('22,', req, res);
  console.log('33', match, mockData);

  if (match) {
    console.log(`mock matched: [${match.method}] ${match.path}`);
    return match.handler(req, res, next);
  }
  return next();
};
