import { CustomWidgetsTypes } from '@/types';

// 右侧组件通用可配置内容
export const defaultCommonSettings = {
  // 用户无需更改这个，
  $id: {
    title: 'ID',
    description: '字段名称/英文',
    type: 'string',
    widget: 'idInput',
    required: true,
    disabled: true,
  },
  title: {
    title: '标题',
    type: 'string',
  },
  description: {
    title: '说明',
    type: 'string',
  },
  default: {
    title: '默认值',
    type: 'string',
  },
  required: {
    title: '必填',
    type: 'boolean',
  },
  placeholder: {
    title: '占位符',
    type: 'string',
  },
  // 暂时不需要，如果需要放开，那么需要处理下面databind的联动效果，直接简单在databind处理即可
  // bind: {
  //   title: 'Bind',
  //   type: 'string',
  // },
  dataBind: {
    title: '数据绑定',
    type: 'object',
    widget: CustomWidgetsTypes.mdData,
  },
  type: {
    title: '数据类型',
    required: true,
    type: 'string',
    widget: 'select',
    enum: ['string', 'number', 'boolean', 'array', 'object', 'range', 'html'],
    enumNames: ['string', 'number', 'boolean', 'array', 'object', 'range', 'html'],
    default: 'string',
  },
  min: {
    title: '最小值',
    type: 'number',
  },
  max: {
    title: '最大值',
    type: 'number',
  },
  disabled: {
    title: '禁用',
    type: 'boolean',
  },
  readOnly: {
    title: '只读',
    type: 'boolean',
  },
  hidden: {
    title: '隐藏',
    type: 'boolean',
  },
  width: {
    title: '元素宽度',
    type: 'string',
    widget: 'percentSlider',
  },
  labelWidth: {
    title: '标签宽度',
    description: '默认值120',
    type: 'number',
    widget: 'slider',
    max: 400,
    props: {
      hideNumber: true,
    },
  },
};
