import type { Request, Response } from 'express';
import { getMockDataByPath } from './util';

export default {
  // 内网图片获取可访问的url地址
  'GET /api/v1/getFile': (req: Request, res: Response) => {
    res.send(getMockDataByPath('upload', req.query.fileName));
  },

  // 上传图片，内网
  'POST /api/v1/uploadFile': async (req: Request, res: Response) => {
    const data = await getMockDataByPath('upload', 'upload');
    res.send(data);
  },

  // 上传图片，外网
  'POST /api/v1/uploadPublicPicture': async (req: Request, res: Response) => {
    const data = await getMockDataByPath('upload', 'uploadPublic');
    res.send(data);
  },
};
