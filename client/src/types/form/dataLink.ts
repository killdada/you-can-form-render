/** 数学符号枚举 */
export type MathSign = '===' | '!==' | '>' | '>=' | '<' | '<=' | 'includes';
export type MathSignText = '等于' | '不等于' | '大于' | '大于等于' | '小于' | '小于等于' | '包含';
export enum EMathSign {
  '===' = '等于',
  '!==' = '不等于',
  '>' = '大于',
  '>=' = '大于等于',
  '<' = '小于',
  '<=' = '小于等于',
  'includes' = '包含',
}

/**
 * @description 数据联动先决条件
 */
export interface DataLinkCondition {
  /** react key */
  id: React.Key;
  /** 字段名称key */
  field: string;
  /** 数学符号 */
  sign: MathSign;
  /** 值类型 */
  type: 'string' | 'number' | 'boolean';
  /** 值,点击、下拉多选可能是数组 */
  value: string | (string | number)[];
  /** 条件组合方式 */
  combine: 'and' | 'or';
}

export interface IFormula {
  /** 当前编辑列的id */
  id?: React.Key;
  /** 展示的表达式，字段label拼接而成 */
  label: string;
  /** 真正的表达式，字段value（id）拼接而成 */
  value: string;
}

/**
 * @description 数据联动根据条件设置的联动table列表
 */
export interface DataLinkAction {
  /** react key */
  id: React.Key;
  /** 字段名称key */
  field: string;
  /** 状态,是否启用 */
  isEnable: boolean;
  /** 可见性 */
  isVisible: boolean;
  /** 必填性 */
  isRequired: boolean;
  /** 不满足是是否清空 */
  isClear: boolean;
  /** 值 */
  formula?: IFormula;
  /** 从已有的select选项勾选出来需要展示的options */
  options?: (string | number)[];
  /** formula里面的公式计算后的值 */
  value?: string | number | undefined;
  /** 联动actions动作依赖的条件字段id列表 */
  conditionsFieldIds?: (string | number)[];
}

/**
 * @description 数据联动列表项
 * @interface DataLinkItem
 */
export interface DataLinkItem {
  /** 联动名称 */
  name: string;
  /** 联动id */
  id: React.Key;
  /** 是否启用 */
  isEnable: boolean;
  /** 数据联动先决条件 */
  conditions?: DataLinkCondition[];
  /**  数据联动根据条件设置的联动table列表 */
  actions?: DataLinkAction[];
  /** 备注 */
  desc?: string;
}
