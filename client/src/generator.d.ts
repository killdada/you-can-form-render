// fr generator 的声明文件
declare namespace Generator {
  /**
   * @description scheme编辑器实例ref，不知道是不是webpack5还是什么配置导致现在需要继承HTMLElement，不然会标红
   */
  export interface GenRef extends HTMLElement {
    getValue: () => Record<string, unknown>;
    setValue: (value: Record<string, unknown>) => void;
    copyValue: () => void;
  }

  /**
   * @export
   * @interface CustomComponentsPropNoChange
   * @description 自定义组件接受的props描述 https://x-render.gitee.io/form-render/advanced/widget
   * @description  部分fr-generator自定义组件可能直接作为formitem的承载体，这个时候onChange应该接受的是 formItem的onChange
   * T value 的结构
   */
  export interface CustomComponentsPropNoChange<T> {
    /**
     * @description  是否禁止输入
     */
    disabled: boolean;
    /**
     * @description  是否只读
     */
    readOnly: boolean;
    /**
     * @description  组件现在的值
     */
    value: T;
    /**
     * @description  组件对应的子 schema
     */
    schema: any;
    /**
     * @description  其他对应的级联属性
     */
    addons: {
      /**
       * @description  注意挂在 addons 下面。用于在本组件内修改其他组件的值 onItemChange(path, value)
       */
      onItemChange: (path: string, value: any) => void;
      /**
       * @description   getValue 获取表单当前的数据
       */
      getValue: (path?: string) => any;
      /**
       * @description   getValue 获取到的表单数据
       */
      formData: any;
      /**
       * @description  用于在本组件内修改其他组件的值 setValue(value, path)
       */
      setValue: (value: any, path: string) => void;
      /**
       * @description  form 方法透传给自定义组件使用，自定义 error
       */
      setErrorFields: (
        error: {
          /** 错误的数据路径 */
          name: string;
          /** 错误的内容 */
          error: string[];
        }[],
      ) => void;
      /**
       * @description  form 方法透传给自定义组件使用，删除所有 error
       */
      removeErrorField: (path: string) => void;
      /**
       * @description  form 方法透传给自定义组件使用，修改 schema
       */
      setSchema: (value: any) => void;
      /**
       * @description  form 方法透传给自定义组件使用，重置清空整个表单
       */
      resetFields: () => void;
      /**
       * @description   目前数据所在的 path，例如"a.b[2].c[0].d"，string 类型。
       */
      dataPath: string;
      /**
       * @description  如果 dataPath 不包含数组，则为 [], 如果 dataPath 包含数组，例如"a.b[2].c[0].d"，则为 [2,0]。是自上到下所有经过的数组的 index 按顺序存放的一个数组类型
       */
      dataIndex: number[];
    };
    /** @description select等绑定options时自定义组件对应的类型，对应内置组件四个，暂时保留，后续如果四组件有特殊要求基于该字段扩展补充 */
    typePorps?: string;
    /**
     * @description select等相关组件，需要区分单选和多选
     */
    comType?: 'sinele' | 'multiple';
    /**
     * @description 预留字段
     */
    [argName: string]: unknown;
  }

  /**
   * @export
   * @interface CustomComProp
   * @description 自定义组件接受的props描述 https://x-render.gitee.io/form-render/advanced/widget
   * T value 的结构
   */
  export interface CustomComponentsProp<T> extends CustomComponentsPropNoChange<T> {
    /**
     * @description  函数，接收 value 为入参，用于将自定义组件的返回值同步给 Form
     */
    onChange: (value: any) => void;
  }
}
