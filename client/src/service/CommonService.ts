import type { RequestResponse } from 'umi-request';
import { http } from '@/utils';
import type { IOrg, IStaff } from '@/types';

import { ApiUrl } from './ApiConfig';

export const CommonService = {
  /**
   * @description 获取公司部门组织架构
   * @returns Promise<any>
   */
  fetchOrgs: () =>
    http.post<RequestResponse<IOrg[]>>(ApiUrl.COMPANY_ORG, {
      data: {
        compId: 0,
      },
    }),

  /**
   * @description  获取公司部门员工情况
   * @returns Promise<any>
   */
  fetchStaff: () =>
    http.post<RequestResponse<IStaff[]>>(ApiUrl.COMPANY_STAFF, {
      data: {
        compId: 0,
        deptId: 0,
      },
    }),
};
