import type { RequestResponse } from 'umi-request';
import http from '@/utils/request';
import { ApiUrl } from './ApiConfig';
import type { IUserInfo } from '@/types';

export const LoginService = {
  /**
   * @description 自动登录获取用户信息接口
   * @returns Promise<IUserInfo>
   */
  autoLogin: () => http.get<RequestResponse<IUserInfo>>(`${ApiUrl.AUTO_LOGIN}`),
};
