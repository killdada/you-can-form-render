import { Controller, Post, Provide } from '@midwayjs/decorator';
import { getMockDataByPath } from './util';

@Provide()
@Controller('/api/v1/aaaCenter')
export class CommonController {
  // 获取公司部门组织架构
  @Post('/listDepartmentRelation')
  async getListDepartmentRelation(): Promise<any> {
    const data = await getMockDataByPath('org');
    return data;
  }

  // 获取公司部门员工情况
  @Post('/listEmployeeRelation')
  async getListEmployeeRelation(): Promise<any> {
    const data = await getMockDataByPath('staff');
    return data;
  }
}
