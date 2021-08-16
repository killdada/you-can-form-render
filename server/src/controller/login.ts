import { Controller, Provide, Get } from '@midwayjs/decorator';
import { getMockDataByPath } from './util';

@Provide()
@Controller('/api/v1')
export class LoginController {
  // 自动登录
  @Get('/login')
  async getFile(): Promise<any> {
    const data = getMockDataByPath('user');
    return data;
  }
}
