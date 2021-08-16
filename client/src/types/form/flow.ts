export enum ApproveStatus {
  /** @description 退回审批 */
  return = 0,
  /** @description 审批通过 */
  success = 1,
  /** @description 加签审批 */
  join = 2,
  /** @description 转签审批 */
  change = 3,
}

/**
 * @enum {number} 审批加签方式 0 前加签，1后加签
 */
export enum JoinStatus {
  /** @description 前加签 */
  foward = 0,
  /** @description 后加签 */
  after = 1,
}

export interface IFlowApproveState {
  /** @description 审批选择状态 */
  status: ApproveStatus;
  /** @description 历史用户任务节点Id,审批退回时选取 */
  destActivityId?: string | number;
  /** @description 审批指定处理人员 */
  staffValue?: string | number;
  /** @description 加签方式 0 前加签 1 后加签 */
  afterFlag?: JoinStatus;
  /** @description 审批意见 */
  comment?: string;
}

export interface IFlowApproveProps {
  /* approve审批提交 */
  approve: (values: IFlowApproveState) => void;
  /* 返回 */
  cancel: () => void;
  /* 撤回 */
  recall: () => void;
  /* 申请人 */
  assigneesName: string;
  /* 是否可撤回 */
  canRecall?: boolean;
  /** 任务节点 */
  taskId?: number | string;
}

export interface IQuery {
  /** @description 业务id */
  businessId?: number;
  /** @description 流程id */
  piId?: number;
  /** @description 任务id */
  taskId?: number;
  /** @description 来源，1 代表从钉钉跳转过来、只有查看权限 0 非钉钉、有提交权限 */
  fromManage?: 1 | 0 | number;
  /** @description 表单类型的概况 1需要手动检验是否有流程提交操作权限，检验通过 fromManage设置为0 */
  messageType?: 1 | 2 | number;
  /** @description flag为真 无此流程节点查看权限 */
  flag?: boolean;
  /** @description 流程是否可撤回，默认可以撤回 - 结束的流程和非申请人的 都不显示撤回按钮 */
  canRecall?: boolean;
  [key: string]: any;
}

// 按钮操作类型  'draft' (草稿提交) | 'basic' （基本提交） | 'approve'（普通正常审批） | 'cancel'（返回） | 'recall' （撤回）| 'approve0'（该表单是审批表，退回操作）| 'approve1'（该表单是审批表，审批通过）| 'approve2'（该表单是审批表，加签审批操作）| 'approve3'（该表单是审批表，转签审批操作）|
export type OperationTypes =
  | 'draft'
  | 'basic'
  | 'approve'
  | 'cancel'
  | 'recall'
  | 'approve0'
  | 'approve1'
  | 'approve2'
  | 'approve3';
