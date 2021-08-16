import type { RequestResponse } from 'umi-request';
import http from '@/utils/request';
import type {
  IDataBase,
  IThirdDataBase,
  IDataBaseParams,
  IThirdDataBaseApis,
  IFormCategory,
  IFormITEM,
  IFormConfig,
} from '@/types';
import { ApiUrl } from './ApiConfig';

export const FormService = {
  /**
   * @description 获取表单详情
   * @param id string 表单id
   * @returns Promise<any>
   */
  fetchFormDetail: (id: string) => http.get(`${ApiUrl.FORMDETAIL}/${id}`),

  /**
   * @description 保存表单详情
   * @param id 表单id
   * @param params 表单提交数据
   * @returns Promise<any>
   */
  saveFormData: (id: string, params: any) =>
    http.post(`${ApiUrl.FORMDETAIL}/${id}`, { data: params }),

  /**
   * @description 获取表单schema信息
   * @param id string 表单id
   * @returns Promise<any>
   */
  fetchFormSchema: (id: string) => http.get(`${ApiUrl.FORMSCHEMA}/${id}`),

  /**
   * @description 保存表单schema
   * @param id 表单id
   * @param params 表单提交schema数据
   * @returns Promise<any>
   */
  saveFormSchema: (id: string, params: any) =>
    http.post(`${ApiUrl.FORMSCHEMA}/${id}`, { data: params }),

  /**
   * @description 获取本地数据来源表数据
   * @returns Promise<IDataBase>
   */
  fetchDataBase: () => http.get<RequestResponse<IDataBase[]>>(ApiUrl.DATABASE),

  /**
   * @description 根据表名获取本地数据表字段列表
   * @param tableName 数据库表名
   * @returns Promise<IThirdDataBase>
   */
  fetchDataBaseParams: (tableName: string) =>
    http.get<RequestResponse<IDataBaseParams[]>>(ApiUrl.DATABASE_PARAMLIST, {
      params: { tableName },
    }),

  /**
   * @description 获取第三方系统列表
   * @returns Promise<IDataBaseParams>
   */
  fetchThirdDataBase: () => http.get<RequestResponse<IThirdDataBase[]>>(ApiUrl.THIRD_DATABASE),

  /**
   * @description 根据传入的应用 Id 获取该第三方系统对应的所有的接口列表
   * @param appId 第三方系统应用 Id
   * @returns Promise<IThirdDataBaseApis>
   */
  fetchThirdDataBaseApis: (appId: string | number) =>
    http.get<RequestResponse<IThirdDataBaseApis[]>>(ApiUrl.THIRD_DATABASE_APIS, {
      params: { appId, isUsed: 1 },
    }),

  /**
   * @description 设计时配置的接口，涉及到的所有远程数据都用这个接口请求，跟之前的linkpage作用一样
   * @returns Promise<any>
   */
  fetchRemoteFormData: <T>(data: any) =>
    http.get<RequestResponse<T>>(ApiUrl.FORMREMOTE, {
      params: data,
    }),

  /**
   * @description 获取表单分类
   * @returns Promise<IFormCategory[]>
   */
  fetchCategoryList: () => http.get<RequestResponse<IFormCategory[]>>(ApiUrl.FORM_CATEGORY_LIST),

  /**
   * @description 获取表单列表
   * @returns Promise<IFormITEM[]>
   */
  fetchFormList: () => http.get<RequestResponse<IFormITEM[]>>(ApiUrl.FORM_LIST),

  /**
   * @description 新增一个表单配置
   * @returns Promise
   */
  addForm: (data: any) => http.post(ApiUrl.FORM_ADD, { data }),

  /**
   * @description 更新一个表单配置
   * @returns Promis
   */
  updateForm: (data: any) => http.post(ApiUrl.FORM_UPDATE, { data }),

  /**
   * @description 获取设计表单配置
   * @returns Promise<IFormConfig>
   */
  getDesignForm: (id: string) =>
    http.get<RequestResponse<IFormConfig>>(`${ApiUrl.FORM_DESIGN_DETAIL}/${id}`),

  /**
   * @description 获取运行时表单配置和业务数据
   * @returns Promise<IFormConfig>
   */
  getFormConfig: (id: string) =>
    http.get<RequestResponse<IFormConfig>>(`${ApiUrl.FORM_RUN_DETAIL}/${id}`),

  /**
   * @description 申请、审批表检验是否有提交权限
   * @returns Promise<any>
   */
  checkAuth: (data: any) => http.post(ApiUrl.FORM_CHECK_AUTH, { data }),

  fetchTableParamList: (tableName: string, defineName: string) =>
    http.get(`${ApiUrl.TABLEPARAMLIST}/${tableName}/${defineName}`),
};
