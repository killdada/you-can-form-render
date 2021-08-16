import type { SelectBindData } from './dataBind';

/**
 * table组件 列
 */
export interface TableSettingDataSourceType {
  /** @description 列组件类型 */
  rowType?: TableColumnComType;
  /** @description 列名称 */
  rowTitle?: string;
  /** @description 是否显示 */
  isShow?: boolean;
  /** @description 是否金额字段 */
  isMoney?: boolean;
  /** @description 是否必填 */
  isRequired?: boolean;
  /** @description 是否禁用 */
  isDisabled?: boolean;
  /** @description 当时select选项的时候是否支持多选 */
  isMultiple?: boolean;
  /** @description 列id */
  id: React.Key;
  /** @description 当rowType为select组件时select绑定的数据 */
  optionState?: SelectBindData;
  /** 对应数据绑定的字段信息key */
  fieldKey?: string;
}

/** @description 数据绑定的时候如果是table组件只需要知道这几个值即可 */
export type TableDataBindSetting = Pick<
  TableSettingDataSourceType,
  'id' | 'rowTitle' | 'fieldKey' | 'rowType'
>;

/**
 * @export
 * @enum {number}
 * @description 列配置每一列渲染的组件类型枚举
 */
export enum TableColumnComType {
  /** @description 纯文本 */
  text = 0,
  /** @description 输入框 */
  input = 1,
  /** @description 按钮 */
  button = 2,
  /** @description 日期选择器 */
  datepick = 3,
  /** @description 选择器 */
  select = 4,
  /** @description 时间选择器 */
  timepick = 5,
}

/**
 * @description table组件每列配置
 */
export interface TableFormItem {
  dataIndex: string;
  entry: Record<string, any>;
  index: number;
  isEditable: boolean;
  key: string;
  title: string;
  type: string;
}

/**
 * @description 表格排序方式 up 升序 0 down 1 降序 默认降序
 */
export enum ETableSort {
  up,
  down,
}

/**
 * @description 表格基础配置
 */
export enum ETableConfig {
  /** @description 禁用新增行 */
  disabledAdd,
  /** @description 禁用删除行 */
  disabledDel,
}
