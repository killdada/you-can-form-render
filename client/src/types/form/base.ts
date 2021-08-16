import type { BindComponentType } from './dataBind';

/**
 * @description 支持的自定义组件类型 md前缀代表设计时使用，mr前缀运行时使用，mz前缀设计运行通用
 * @export
 * @enum CustomComponentsWidgets
 */
export enum CustomWidgetsTypes {
  /**
   * @description 数据绑定组件，设计时使用
   */
  mdData = 'mdData',
  /**
   * @description 表单绑定接口组件，设计时使用
   */
  mdForm = 'mdForm',
  /**
   * @description 表单分类、关联表单select组件
   */
  mdSimpleSelect = 'mdSimpleSelect',
  /**
   * @description 校验规则组件，设计时使用
   */
  mdRegexpSelect = 'mdRegexpSelect',

  /**
   * @description 表格数据设置
   */
  mdTableSetting = 'mdTableSetting',

  /**
   * @description radio、checkbox、select等组件绑定数据来源，设计时使用
   */
  mdSelect = 'mdSelect',
  /**
   * @description 内置的省市区组件
   */
  mrCitySelect = 'mrCitySelect',
  /**
   * @description 上传图片组件
   */
  mrUpload = 'mrUpload',
  /**
   * @description 数据联动交互处理组件 设计时
   */
  mdDataLink = 'mdDataLink',

  /**
   * @description 表格组件
   */
  mrTable = 'mrTable',
}

/**
 * @export
 * @interface CustomFormItemProps
 * @template T
 * @description antd 自定义formitem包裹需要的结构
 */
export interface CustomFormItemProps<T> {
  /**
   * 组件接受到的props值
   */
  value?: T;
  /**
   * 改变数据提交到父组件
   */
  onChange?: (value: T) => void;
  /**
   * 其他预留字段
   */
  [key: string]: any;
}

/**
 * @interface IFlattenData
 * @description 扁平化后的结构
 */
export interface IFlattenData {
  /**
   * @description 所属父级id
   */
  parent: string | undefined;
  /**
   * @description 当前组件schema数据
   */
  schema: any;
  /**
   * @description 当前组件的子组件id列表
   */
  children: any[];
}

/**
 * @description 组装后返回的字段数组结构 （契合select）
 */
export interface FieldsData extends IFlattenData {
  label: string;
  value: string;
}

/**
 * string #/ #/a #/a/b 其中 #/a/b代表这个b是a的子集
 */
export type IFlattenItem = Record<string, IFlattenData>;

/**
 * @description schema组装之后的需要的接口请求的远程数据相关
 * @interface IFormatRemoteData
 */
export interface IFormatRemoteData {
  /**
   * @description 组件id，字段id
   */
  id: string;
  /**
   * @description 类型，select类型的情况下请求完需要额外处理赋值
   */
  type: BindComponentType;
  /**
   * @description type select label对应远程接口返回的字段名
   */
  label?: string | number;
  /**
   * @description type select value 对应远程接口返回的字段名
   */
  value?: string | number;
  /**
   * @description 远程接口需要的查询参数数据
   */
  query?: Record<string | number, any>;
  /**
   * @description 数据绑定接口以后，该字段对应绑定的接口key,
   */
  field?: string[];
  /**
   * @description select绑定远程数据时，同个select绑定同一个接口，为了只发起一个请求，优化组合到了一起处理
   */
  selectData?: IFormatRemoteData[];
  /**
   * @description 是否是table组件，type === data的时候增加isTable和其他字段区分开来
   */
  isTable?: boolean;
}

/**
 * @description 因为useRef的问题，如果和loading在同一个组件导致ref为空，这里包裹了一层顺便传递了props接口
 * @interface WrapperSchemaProps
 */
export interface WrapperSchemaProps {
  /** @description 表单请求下来的schema信息,可传递，或者是直接拿umi model里的值 */
  schema?: any;
  /** @description 表单id */
  id: string;
  /** @description 表单是新增还是编辑，通过id是不是undefined判断 */
  isEdit?: string;
}

/**
 * @export
 * @enum {number} apply 申请表 1  approve 审批表2  feature 功能表 3
 */
export enum FormTypes {
  apply = 1,
  approve = 2,
  feature = 3,
}

// 上传组件的文件类型，img other
export type UploadFileType = 'img' | 'other';

/**
 * @description 通用的modal组件ref 一般是modal嵌套的时候使用，提供一个open方法，父组件直接打开弹窗并赋值
 */
export type ModalRef<T> = {
  /**
   * @description 打开弹窗，
   * @param data 传递当前弹窗需要的数据
   * @param isEdit 该弹窗是编辑还是新增
   */
  open: (data: T, isEdit?: boolean) => void;
} | null;
