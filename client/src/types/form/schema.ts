// Schema结构很灵活，这里定义一些基础常见的结构即可
import type { FormTypes } from './base';
import type { FormBindData, IDataBind, RemoteBindData } from './dataBind';
import type { DataLinkItem } from './dataLink';
import type { ETableConfig, ETableSort, TableSettingDataSourceType } from './table';

// 上面这些基本是内置的schema结构类型
export interface IBaseSchemaCommonProps {
  /** @description 组件唯一id 字段名称/英文 */
  $id: string;
  /** @description 标题 */
  title: string;
  /** @description 说明 */
  description: string;
  /** @description 默认值 */
  default: any;
  /** @description 必填 */
  required: boolean;
  /** @description 占位符 */
  placeholder: string;
  /** @description 数据类型 */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'range' | 'html';
  /** @description 最小值 */
  min: number;
  /** @description 最大值 */
  max: number;
  /** @description 禁用 */
  disabled: boolean;
  /** @description 只读 */
  readOnly: boolean;
  /** @description 隐藏 */
  hidden: boolean;
  /** @description 元素宽度 */
  width: number;
  /** @description 标签宽度 */
  labelWidth: number;
  /** @description 检验规则 */
  rules: any[];
  /** @description 组件内置props */
  props: any;
  /** @description options对应的value */
  enum: (string | number)[];
  /** @description options对应的label */
  enumNames: (string | number)[];
  /** @description 指定要那个组件渲染 */
  widget: string;
  [key: string]: any;
}

// 根据业务实际情况扩展的类型
export interface ISchemaCommonProps extends Partial<IBaseSchemaCommonProps> {
  /** @description 数据绑定 */
  dataBind: IDataBind;
  /** @description options类数据绑定 */
  enumDataBind: RemoteBindData;
  /** @description 表格列配置绑定 */
  columnTableDataBind: TableSettingDataSourceType[];
  /** @description 表格是否可以导入 */
  canImport: boolean;
  /** @description 表格是否可以导出 */
  canExport: boolean;
  isAddOrDel: ETableConfig[];
  /** @description 表格新增的排序方式 */
  addType: ETableSort;
  [key: string]: any;
}

// 自带的基础结构
export interface IBaseSchema {
  /* @description 结构类型 */
  type: string;
  /* @description 上下排列，还是左右排列 */
  displayType: 'column' | 'row';
  /* @description 一行展示多少个 */
  column: number;
  /* @description 全局标签宽度 */
  labelWidth: number;
  /* @description schema object对应需要的properties */
  properties: Record<string, ISchemaCommonPropsPartial>;
  [key: string]: any;
}

export interface ISchema extends Partial<IBaseSchema> {
  /* @description 表单远程数据全局绑定 */
  formDataBind: FormBindData;
  /* @description 表单联动数据绑定 */
  dataLink: DataLinkItem[];
  formName: number;
  /* @description 表单的类型 */
  formType: FormTypes;
  /* @description 表单所属分类 */
  formCategory: number;
  /* @description 审批表单管理的表单id */
  relFormId: string | number;
  /* @description 表单描述 */
  formDesc: number;
  /* @description 审批表是否需要审批 */
  isNeedApprove: boolean;
  [key: string]: any;
}

export type ISchemaPartial = Partial<ISchema>;
export type ISchemaCommonPropsPartial = Partial<ISchemaCommonProps>;
