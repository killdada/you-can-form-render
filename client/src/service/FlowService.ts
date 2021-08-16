import type { RequestResponse } from 'umi-request';
import { http, getUser } from '@/utils';
import type { IApproveLogItem, IOPINION, ITASKLIST } from '@/types';

import { ApiUrl } from './ApiConfig';

export const FlowService = {
  /**
   * @description 流程撤回
   * @param data
   * @returns Promise<any>
   */
  recall: (data: any) => http.post(ApiUrl.FLOW_RECALL, { data }),

  /**
   * @description 保存草稿
   * @param data
   * @returns Promise<any>
   */
  saveDraft: (data: any) => http.post(ApiUrl.SAVE_DRAFT, { data }),

  /**
   * @description  获取审批历史列表
   * @param data
   * @returns Promise<any>
   */
  fetchApproveLogs: (query: any) =>
    http.get<RequestResponse<IApproveLogItem[]>>(ApiUrl.APPROVE_LOG, { query }),

  /**
   * @description 审批接口
   * @param data
   * @returns Promise<any>
   */
  approve: (data: any) => http.post(ApiUrl.APPROVE, { data }),

  /**
   * @description  自定义表单提交数据
   * @param data
   * @returns Promise<any>
   */
  formSubmit: (data: any) => http.post(ApiUrl.FORM_SUBMIT, { data }),

  /**
   * @description  获取历史用户任务节点列表（用于退回指定节点选择
   * @param data
   * @returns Promise<any>
   */
  fetchHistoryTasks: (taskId: string | number) =>
    http.get<RequestResponse<ITASKLIST[]>>(`${ApiUrl.HISTORY_TASKLIST}/${taskId}`),

  /**
   * @description 加签
   * @param data
   * @returns Promise<any>
   */
  joinApprove: (data: any) => http.post(ApiUrl.JOIN_APPROVE, { data }),

  /**
   * @description 转签
   * @param data
   * @returns Promise<any>
   */
  changeApprove: (data: any) => http.post(ApiUrl.CHANGE_APPROVE, { data }),

  /**
   * @description  用户个人审批意见列表查询
   * @returns Promise<any>
   */
  getOpinions: () =>
    http.get<RequestResponse<IOPINION[]>>(ApiUrl.COMMENT_LIST, {
      query: { userId: getUser('userId') },
    }),

  /**
   * @description 用户个人审批意见列表添加
   * @param data
   * @returns Promise<any>
   */
  saveOpinions: (opinions: string[]) =>
    http.post(ApiUrl.UPDATE_COMMENT, {
      data: {
        userId: getUser('userId'),
        createBy: getUser('userId'),
        opinions,
      },
    }),
};
