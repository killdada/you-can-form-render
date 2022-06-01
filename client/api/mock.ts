import type { VercelRequest, VercelResponse } from '@vercel/node';

const path = require('path');
const { getMockData, matchMock } = require('../mock');

function extendReq(req) {
  return {
    ...req,
    path: req.url.split('?')[0]
  }
}


export default function withApiMockHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log('mock.js', req.body, req.url, req.method, req.query);
  try {
    const { mockData } = getMockData({ cwd: path.join(__dirname, '../') });
    const reqCopy = extendReq(req)
    const match = mockData && matchMock(reqCopy, mockData);

    if (match) {
      console.log(`mock matched: [${match.method}] ${match.path}`);
      match.handler(reqCopy, res);

    } else {
      res.send('api接口不存在');
    }
  } catch (e) {
    console.error('mock.js', e, req.body);
    res.send(e)
  }
};
