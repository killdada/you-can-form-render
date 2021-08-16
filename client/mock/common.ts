import type { Request, Response } from 'express';
import { getMockDataByPath } from './util';

export default {
  // 获取公司部门组织架构
  'POST /api/v1/aaaCenter/listDepartmentRelation': async (req: Request, res: Response) => {
    const data = await getMockDataByPath('org');
    res.send(data);
  },

  // 获取公司部门员工情况
  'POST /api/v1/aaaCenter/listEmployeeRelation': async (req: Request, res: Response) => {
    const data = await getMockDataByPath('staff');
    res.send(data);
  },
};
