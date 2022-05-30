const path = require('path');
const { getMockData, matchMock } = require('../mock');

module.exports = (req, res) => {
  console.log('mock.js', req.body, req.url, req.method);
  // try {
  const { mockData } = getMockData({ cwd: path.join(__dirname, './') });
  const match = mockData && matchMock(req, mockData);

  console.log('mmm', match);

  // window.test.ii();

  if (match) {
    console.log(`mock matched: [${match.method}] ${match.path}`);
    res.send(match.handler(req, res));
  } else {
    res.send('api接口不存在');
  }
  // } catch (e) {
  //   console.error('mock.js', e, req.body);
  // }
};
