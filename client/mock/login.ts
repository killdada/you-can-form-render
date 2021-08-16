import type { Request, Response } from 'express';
import { getMockDataByPath } from './util';

export default {
  // 自动登录
  '/api/v1/login': (req: Request, res: Response) => {
    res.send(getMockDataByPath('user'));
  },
};
