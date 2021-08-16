import type { RequestResponse } from 'umi-request';
import http from '@/utils/request';
import { ApiUrl } from './ApiConfig';

export const UploadService = {
  /**
   * @description  内网图片获取真实url地址
   * @param fileName 文件名
   * @returns Promise<any>
   */
  getFileUrl: (fileName: string) =>
    http.get<RequestResponse<string>>(`${ApiUrl.GET_FILE_URL}`, { params: { fileName } }),
};
