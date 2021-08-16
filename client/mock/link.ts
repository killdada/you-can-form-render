import type { Request, Response } from 'express';
import { getMockDataByPath } from './util';

export default {
  // 获取本地数据库来源表
  '/api/design/form/table/list': (req: Request, res: Response) => {
    res.send(getMockDataByPath('database'));
  },

  // 根据选择的本地数据库表名获取字段列表
  '/api/design/form/param/list': (req: Request, res: Response) => {
    const {
      query: { tableName = '' },
    } = req || {};
    res.send(getMockDataByPath('databaseDetailByName', tableName));
  },

  // 获取第三方系统来源表
  '/api/design/app/list': (req: Request, res: Response) => {
    res.send(getMockDataByPath('thirdDataBase'));
  },

  // 根据 appId 应用id获取第三方数据库接口列表
  '/api/v1/activiti/design/app/interface/list': (req: Request, res: Response) => {
    const {
      query: { appId = '' },
    } = req || {};
    res.send(getMockDataByPath('thirdDataBaseById', appId, []));
  },

  // 之前的linkpage接口，远程数据接口
  'GET /api/design/form/linkage': (req: Request, res: Response) => {
    // 省市区模拟
    let data = getMockDataByPath('linkpage', req.query.appInterId, {});
    if (typeof req.query.cityId !== 'undefined') {
      data = getMockDataByPath('city', `areaList.${req.query.cityId}`, []);
    } else if (typeof req.query.provinceId !== 'undefined') {
      data = getMockDataByPath('city', `cityList.${req.query.provinceId}`, []);
    } else if (typeof req.query.countryId !== 'undefined') {
      data = getMockDataByPath('city', 'provinceList', []);
    }
    res.send(data);
  },
};
