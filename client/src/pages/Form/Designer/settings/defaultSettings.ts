import { CustomWidgetsTypes, ETableConfig, ETableSort } from '@/types';

export const elements = [
  {
    text: '输入框',
    name: 'input',
    schema: {
      title: '输入框',
      type: 'string',
      rules: [],
    },
    setting: {
      props: {
        title: '选项',
        type: 'object',
        labelWidth: 80,
        properties: {
          allowClear: {
            title: '是否带清除按钮',
            description: '填写内容后才会出现x哦',
            type: 'boolean',
          },
          addonBefore: {
            title: '前tab',
            type: 'string',
          },
          addonAfter: {
            title: '后tab',
            type: 'string',
          },
          prefix: {
            title: '前缀',
            type: 'string',
          },
          suffix: {
            title: '后缀',
            type: 'string',
          },
        },
      },
      minLength: {
        title: '最短字数',
        type: 'number',
      },
      maxLength: {
        title: '最长字数',
        type: 'number',
      },
      pattern: {
        title: '选择校验规则',
        type: 'object',
        widget: CustomWidgetsTypes.mdRegexpSelect,
      },
    },
  },
  {
    text: '大输入框',
    name: 'textarea',
    schema: {
      title: '编辑框',
      type: 'string',
      format: 'textarea',
    },
    setting: {
      props: {
        title: '选项',
        type: 'object',
        labelWidth: 80,
        properties: {
          autoSize: {
            title: '高度自动',
            type: 'boolean',
          },
          row: {
            title: '指定高度',
            type: 'number',
          },
        },
      },
      minLength: {
        title: '最短字数',
        type: 'number',
      },
      maxLength: {
        title: '最长字数',
        type: 'number',
      },
      pattern: {
        title: '校验正则表达式',
        type: 'array',
        widget: CustomWidgetsTypes.mdRegexpSelect,
      },
    },
  },
  {
    text: '日期选择',
    name: 'date',
    schema: {
      title: '日期选择',
      type: 'string',
      format: 'date',
    },
    setting: {
      format: {
        title: '格式',
        type: 'string',
        enum: ['dateTime', 'date', 'time'],
        enumNames: ['日期时间', '日期', '时间'],
      },
    },
  },
  {
    text: '数字输入框',
    name: 'number',
    schema: {
      title: '数字输入框',
      type: 'number',
    },
    setting: {},
  },
  {
    text: '是否选择',
    name: 'checkbox',
    schema: {
      title: '是否选择',
      type: 'boolean',
      widget: 'checkbox',
    },
    setting: {
      default: {
        title: '是否默认勾选',
        type: 'boolean',
      },
    },
  },
  {
    text: '是否switch',
    name: 'switch',
    schema: {
      title: '是否选择',
      type: 'boolean',
      widget: 'switch',
    },
    setting: {
      default: {
        title: '是否默认开启',
        type: 'boolean',
      },
    },
  },
  {
    text: '下拉单选',
    name: 'select',
    schema: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'select',
    },
    setting: {
      enumDataBind: {
        title: 'options绑定',
        type: 'object',
        widget: CustomWidgetsTypes.mdSelect,
        comType: 'signle',
        typePorps: 'select',
      },
    },
  },
  {
    text: '点击单选',
    name: 'radio',
    schema: {
      title: '单选',
      type: 'string',
      enum: ['a', 'b', 'c'],
      enumNames: ['早', '中', '晚'],
      widget: 'radio',
    },
    setting: {
      enumDataBind: {
        title: 'options绑定',
        type: 'object',
        widget: CustomWidgetsTypes.mdSelect,
        comType: 'signle',
        typePorps: 'radio',
      },
    },
  },
  {
    text: '下拉多选',
    name: 'multiSelect',
    schema: {
      title: '多选',
      description: '下拉多选',
      type: 'array',
      items: {
        type: 'string',
      },
      enum: ['A', 'B', 'C', 'D'],
      enumNames: ['杭州', '武汉', '湖州', '贵阳'],
      widget: 'multiSelect',
    },
    setting: {
      enumDataBind: {
        title: 'options绑定',
        type: 'object',
        widget: CustomWidgetsTypes.mdSelect,
        comType: 'multiple',
        typePorps: 'multiSelect',
      },
    },
  },
  {
    text: '点击多选',
    name: 'checkboxes',
    schema: {
      title: '多选',
      type: 'array',
      widget: 'checkboxes',
      items: {
        type: 'string',
      },
      enum: ['A', 'B', 'C', 'D'],
      enumNames: ['杭州', '武汉', '湖州', '贵阳'],
    },
    setting: {
      enumDataBind: {
        title: 'options绑定',
        type: 'object',
        widget: CustomWidgetsTypes.mdSelect,
        comType: 'multiple',
        typePorps: 'checkboxes',
      },
    },
  },
  {
    text: 'HTML',
    name: 'html',
    schema: {
      title: 'HTML',
      type: 'string',
      widget: 'html',
    },
    setting: {
      default: {
        title: '展示内容',
        type: 'string',
      },
    },
  },
  {
    text: '省市区',
    name: 'cityselect',
    schema: {
      className: 'fr-generator-field-cityselect',
      title: '省市区',
      type: 'array',
      widget: CustomWidgetsTypes.mrCitySelect,
      items: {
        type: 'string',
      },
    },
    setting: {},
  },
  {
    text: '上传',
    name: 'upload',
    schema: {
      title: '文件上传',
      type: 'string',
      widget: CustomWidgetsTypes.mrUpload,
      description: '单个文件大小限制50M，最多上传5个文件；如果超过5个，请打包上传。',
      items: {
        type: 'object',
      },
    },
    setting: {
      fileType: {
        title: '文件类型',
        type: 'string',
        enum: ['img', 'other'],
        enumNames: ['图片类型', '其他'],
        widget: 'radio',
        default: 'img',
      },
      isPublic: {
        title: '是否公用',
        type: 'boolean',
        widget: 'checkbox',
        default: true,
      },
    },
  },
  {
    text: '表格',
    name: 'table',
    schema: {
      title: '表格',
      type: 'string',
      widget: CustomWidgetsTypes.mrTable,
      canExport: false,
      canImport: false,
      isAddOrDel: [],
    },
    setting: {
      canExport: {
        title: '数据导出',
        type: 'boolean',
        widget: 'checkbox',
        default: false,
      },
      canImport: {
        title: '数据导入',
        type: 'boolean',
        widget: 'checkbox',
      },
      isAddOrDel: {
        title: '数据配置',
        type: 'array',
        widget: 'checkboxes',
        enum: [ETableConfig.disabledAdd, ETableConfig.disabledDel],
        enumNames: ['禁用新增行', '禁用删除行'],
      },
      addType: {
        title: '新增行方式',
        type: 'string',
        widget: 'radio',
        enum: [ETableSort.up, ETableSort.down],
        enumNames: ['升序', '降序'],
        default: ETableSort.down,
      },
      columnTableDataBind: {
        title: '表格配置',
        type: 'array',
        widget: CustomWidgetsTypes.mdTableSetting,
      },
    },
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const saves = [
  {
    text: '复杂结构样例',
    name: 'something',
    schema: {
      title: '对象',
      description: '这是一个对象类型',
      type: 'object',
      properties: {
        inputName: {
          title: '简单输入框',
          type: 'string',
        },
        selectName: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        dateName: {
          title: '时间选择',
          type: 'string',
          format: 'date',
        },
        listName: {
          title: '对象数组',
          description: '对象数组嵌套功能',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rangeName: {
                title: '日期/时间范围',
                type: 'range',
                format: 'date',
                props: {
                  placeholder: ['开始日期', '结束日期'],
                },
              },
            },
          },
        },
      },
    },
  },
];

// 左侧默认加载的组件
export const defaultSettings = [
  {
    title: '基础组件',
    widgets: elements,
    show: true,
  },
  // {
  //   title: '模板',
  //   widgets: saves,
  // },
];
