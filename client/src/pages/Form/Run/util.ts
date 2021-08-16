import type { IUserInfo, IQuery, OperationTypes } from '@/types';
import { isPhone } from '@/constants';

import { redirect } from '@/utils/base';
import { changeTitle } from '@/utils';
import { FlowService } from '@/service';

// 提交的三个接口方法映射
export const submitFuncMap: Record<OperationTypes | string, any> = {
  /** 普通提交 */
  basic: FlowService.formSubmit,
  /** 普通审批 */
  approve: FlowService.approve,
  /** 草稿 */
  draft: FlowService.saveDraft,
  /** 撤回 */
  recall: FlowService.recall,
  /** 审批表单  退回 */
  approve0: FlowService.approve,
  /** 审批表单  通过 */
  approve1: FlowService.approve,
  /** 审批表单  加签 */
  approve2: FlowService.joinApprove,
  /** 审批表单  转签 */
  approve3: FlowService.changeApprove,
};

export const basicSubmitCheck = (initialState = {} as IUserInfo) => {
  // 判断有没有存上级id和用户id
  if (!initialState.supervisorId) {
    return 'session中没有存到该用户的上级id，请添加上级后再提交表单！';
  }
  if (!initialState.userId) {
    return 'session中没有存到该用户的id，请联系管理员！';
  }

  if (!initialState.officerId) {
    return 'session中没有存到该用户的所属部门负责人id，请联系管理员！';
  }
  return false;
};

// 统一处理提交、草稿，返回，撤回按钮的会跳地址
export const toRedirectUrl = (type: OperationTypes, query: IQuery = {}) => {
  // 表单是审批表单跳转的地址跟approve正常审批地址一样
  const newType = type.includes('approve') ? 'approve' : type;
  // 返回、基本提交、草稿的初始地址路径是initiate
  let breadUrl = ['cancel', 'basic', 'draft'].includes(newType)
    ? '#/serviceManage/flow/initiate'
    : '#/serviceManage/flow/manage';

  if (query.businessId) {
    breadUrl = '#/serviceManage/flow/todo';
    // 返回、撤回的地址还需要判断fromManage
    if (['cancel', 'recall'].includes(newType) && query.fromManage === 1) {
      breadUrl = '#/serviceManage/flow/manage';
    }
  }
  if (!isPhone) {
    redirect(breadUrl);
    return;
  }
  // 返回、草稿需要更改页面标题
  if (['cancel', 'draft'].includes(newType)) {
    changeTitle('erp管理系统');
  }

  if (['recall', 'approve'].includes(newType)) {
    redirect('#/remindCenter/remindMessage/mobileRemind');
    return;
  }

  if (type === 'basic') {
    redirect('#/mobilePage/submitSuccess');
    return;
  }

  if (type === 'cancel') {
    if (query.businessId) {
      redirect('#/remindCenter/remindMessage/mobileRemind');
      return;
    }
    redirect('#/mobilePage/flowList');
    return;
  }

  redirect('#/mobilePage/flowList');
};
