import {
  Controller,
  Query,
  Provide,
  ALL,
  Post,
  Get,
} from '@midwayjs/decorator';
import { getMockDataByPath } from './util';

@Provide()
@Controller('/api/v1')
export class UploadController {
  // 内网图片获取可访问的url地址
  @Get('/getFile')
  async getFile(
    @Query(ALL)
    query: any
  ): Promise<any> {
    const data = getMockDataByPath('upload', query.fileName);
    return data;
  }

  // 上传图片，内网
  @Post('/uploadFile')
  async uploadFile(): Promise<any> {
    const data = await getMockDataByPath('upload', 'upload');
    return data;
  }

  // 上传图片，外网
  @Post('/uploadPublicPicture')
  async uploadPublicPicture(): Promise<any> {
    const data = await getMockDataByPath('upload', 'uploadPublic');
    return data;
  }
}

