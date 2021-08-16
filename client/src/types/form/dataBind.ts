import type { TableDataBindSetting } from './table';

/** @description remoteBind 组件绑定的类型 form 表单配置页数据绑定接口； select select组件绑定options数据来源，data 数据组件绑定接口和对应的字段  */
export type BindComponentType = 'form' | 'select' | 'data';

export enum ERemoteBindType {
  /**
   * 根据数据库来源表
   */
  database = 'database',
  /**
   * 根据第三方系统来源表
   */
  thirdDataBase = 'thirdDataBase',
  /**
   * 固定值，select 等需要 options 采取本地输入的形式
   */
  fixed = 'fixed',
}

/**
 * @description 数据绑定组件取值方式的枚举
 */
export enum EDataBindType {
  /**
   * 根据远程获取数据，表单配置里面表单数据绑定来源选择 database  thirdDataBase 该值为真
   */
  remote = 'remote',
  /**
   * remote是直接绑定表单配置里面的接口对应的字段，otherRemote允许用户直接跟接口进行关联 （同一个表单里面的字段数据绑定接口支持多个接口）
   */
  otherRemote = 'otherRemote',
  /**
   * 系统变量
   */
  system = 'system',
}

/**
 * @description 查询条件参数的值，支持string,number类型
 */
export type QueryConditionsParamType = 'string' | 'number';

/**
 * @description 查询条件参数的来源方式枚举
 */
export enum QueryConditionsValMethod {
  /**
   * @description 固定值
   */
  fixed = 'fixed',
  /**
   * @description 来源于url参数
   */
  url = 'url',
  /**
   * @description 来源于本页面字段
   */
  field = 'field',
  /**
   * 来源于系统变量
   */
  system = 'system',
}

/**
 * @description 查询条件的ref
 */
export type QueryConditionsRef = {
  /**
   * @description 清空查询条件
   */
  clear: () => void;
} | null;

/**
 * @description 接口查询条件
 * @export
 * @interface QueryConditionsVal
 */
export interface QueryConditionsVal {
  /**
   * @type {string}
   * @description 当前行 id
   */
  id: React.Key;
  /**
   * @description 参数名，英文
   */
  name?: string;
  /**
   * @description 查询条件参数的值，支持string,number类型
   */
  type?: QueryConditionsParamType;
  /**
   * @description 查询条件参数的值来源方式，枚举自 QueryConditionsValMethod
   */
  method?: QueryConditionsValMethod;
  /**
   * @description 查询条件的值或者key
   */
  value?: string;
  /**
   * @description 该参数是否必须
   */
  required?: boolean;
}

/**
 * @export
 * @interface IDataBind
 * @description 数据绑定组件接受的props.value值
 */
export interface IDataBind extends Partial<RemoteBindData> {
  /**
   * @description 数据绑定方式
   */
  sourceMethod?: EDataBindType;
  /**
   * @description 数组绑定的字段
   */
  field?: string | TableDataBindSetting[];
}

/**
 * @export
 * @interface FormBindData
 * @description 表单数据组件接受的props.value值
 */
export interface FormBindData {
  /**
   * @description 数据来源方式
   */
  dataSourceMethod: ERemoteBindType | undefined;
  /**
   * @description 数据来源表名
   */
  databaseTableName?: string;
  /**
   * @description 第三方系统 Id
   */
  appId?: string | number;
  /**
   * @description 第三方系统 接口名称 ID
   */
  appInterId?: string;
  /**
   * @description 第三方系统 接口相对地址
   */
  appInterAddr?: string;
  /**
   * @description 接口查询条件
   */
  queryConditions: QueryConditionsVal[];
  /**
   *  @description 其他字段，组装数据的时候可能会额外增加一些字段
   */
  [argName: string]: any;
}

/**
 * @description 固定选项的时候应该区分单选和多选
 */
export type TOptionsType = 'single' | 'multiple';

/**
 * @description 单选多选等选项接口
 */
export interface IOptions {
  /** @description react key */
  id: React.Key;
  /** @description label显示名称 */
  label: string | number;
  /** @description 选项值 */
  value: string | number;
  /** @description 选项是否默认 */
  default: boolean;
}

/**
 * @description select等需要绑定数据来源的配置结构
 */
export interface SelectBindData extends FormBindData {
  /**
   * @description 固定options列表数据
   */
  options?: IOptions[];
  /** @description 远程 options 取的label 数据库字段key */
  label?: string | number;
  /** @description 远程 options 取的value 数据库字段key */
  value?: string | number;
}

export type RemoteBindData = SelectBindData;
