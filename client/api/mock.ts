import type { VercelRequest, VercelResponse } from '@vercel/node';

const path = require('path');
const { getMockData, matchMock } = require('../mock');

export default function withApiMockHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log('mock.js', req.body, req.url, req.method);
  try {
    const { mockData } = getMockData({ cwd: path.join(__dirname, '../') });
    const match = mockData && matchMock(req, mockData);

    if (match) {
      console.log(`mock matched: [${match.method}] ${match.path}`);
      match.handler(req, res);

    } else {
      res.send('api接口不存在');
    }
  } catch (e) {
    console.error('mock.js', e, req.body);
    res.send(e)
  }
};
