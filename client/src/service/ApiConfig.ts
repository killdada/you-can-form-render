// API url config

const API_PREFIX = '/api';

// 建议接口都是 REST url 地址
export const ApiUrl = {
  /**
   * @description 表单schema
   */
  FORMSCHEMA: `${API_PREFIX}/form/schema`,
  /**
   * @description 表单详情
   */
  FORMDETAIL: `${API_PREFIX}/form/detail`,
  /**
   * @description 远程数据之前的linkpage接口
   */
  FORMREMOTE: `${API_PREFIX}/design/form/linkage`,
  /**
   * @description 本地数据库来源表
   */
  DATABASE: `${API_PREFIX}/design/form/table/list`,
  /**
   * @description 本地数据库表名获取字段列表
   */
  DATABASE_PARAMLIST: `${API_PREFIX}/design/form/param/list`,
  /**
   * @description 第三方系统来源表
   */
  THIRD_DATABASE: `${API_PREFIX}/design/app/list`,
  /**
   * @description 字段列表
   */
  TABLEPARAMLIST: `${API_PREFIX}/design/form/sub/column`,
  /**
   * @description 第三方数据库接口列表
   */
  THIRD_DATABASE_APIS: `${API_PREFIX}/v1/activiti/design/app/interface/list`,
  /** @description 自动登录 */
  AUTO_LOGIN: `${API_PREFIX}/v1/login`,
  /** @description 内网图片获取真实url地址 */
  GET_FILE_URL: `${API_PREFIX}/v1/getFile`,

  /** @description 表单分类 */
  FORM_CATEGORY_LIST: `${API_PREFIX}/design/form/category/list`,

  /** @description 表单列表 */
  FORM_LIST: `${API_PREFIX}/design/form/base/list`,

  /** @description 新增一个表单 */
  FORM_ADD: `${API_PREFIX}/design/form/add`,

  /** @description 更新一个表单 */
  FORM_UPDATE: `${API_PREFIX}/design/form/update`,

  /** @description 设计时获取表单配置 */
  FORM_DESIGN_DETAIL: `${API_PREFIX}/design/form/get`,

  /** @description 获取运行时表单配置和业务数据 */
  FORM_RUN_DETAIL: `${API_PREFIX}/design/form/detail`,

  /** @description 申请、审批表检验是否有提交权限 */
  FORM_CHECK_AUTH: `${API_PREFIX}/v1/activiti/design/message/check`,

  /** @description 流程撤回 */
  FLOW_RECALL: `${API_PREFIX}/design/proc/recall`,

  /** @description 表单提交保存草稿 */
  SAVE_DRAFT: `${API_PREFIX}/design/proc/save`,

  /** @description 自定义表单提交数据 */
  FORM_SUBMIT: `${API_PREFIX}/v1/activiti/design/proc/submit`,

  /** @description 获取审批历史列表 */
  APPROVE_LOG: `${API_PREFIX}/v1/activiti/approveLog`,

  /** @description 审批接口 */
  APPROVE: `${API_PREFIX}/design/proc/approve`,

  /** @description 获取历史用户任务节点列表（用于退回指定节点选择） */
  HISTORY_TASKLIST: `${API_PREFIX}/design/proc/history`,

  /** @description 加签 */
  JOIN_APPROVE: `${API_PREFIX}/design/proc/joint`,

  /** @description 转签 */
  CHANGE_APPROVE: `${API_PREFIX}/design/proc/change`,

  /** @description 用户个人审批意见列表查询 */
  COMMENT_LIST: `${API_PREFIX}/v1/activiti/design/opinion/list`,

  /** @description 用户个人审批意见列表添加 */
  UPDATE_COMMENT: `${API_PREFIX}/v1/activiti/design/opinion/save`,

  /** @description 获取公司部门组织架构 */
  COMPANY_ORG: `${API_PREFIX}/v1/aaaCenter/listDepartmentRelation`,

  /** @description 获取公司部门员工情况 */
  COMPANY_STAFF: `${API_PREFIX}/v1/aaaCenter/listEmployeeRelation`,
};
