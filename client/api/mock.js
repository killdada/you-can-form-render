// 该服务为 vercel serve跨域处理
const { getMockData, matchMock } = require('../umi/mock');

module.exports = (req, res) => {
  console.log('mock.js', req.body);
  try {
    const { mockData } = getMockData({
      cwd: `../`,
    });
    const match = mockData && matchMock(req, mockData);

    if (match) {
      console.log(`mock matched: [${match.method}] ${match.path}`);
      res.send(match.handler(req, res));
    } else {
      res.send('api接口不存在');
    }
  } catch (e) {
    console.error('mock.js', e, req.body);
  }
};
