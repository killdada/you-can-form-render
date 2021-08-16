import { CustomWidgetsTypes, FormTypes } from '@/types';

// 右侧表单全局配置
export const defaultGlobalSettings = {
  type: 'object',
  properties: {
    formName: {
      title: '表单名称',
      type: 'string',
      required: true,
    },
    formCategory: {
      required: true,
      title: '表单分类',
      type: 'number',
      widget: CustomWidgetsTypes.mdSimpleSelect,
      selectType: 'category',
    },
    formType: {
      title: '表单类型',
      type: 'number',
      required: true,
      widget: 'select',
      enum: [FormTypes.apply, FormTypes.approve, FormTypes.feature],
      enumNames: ['申请表', '审批表', '功能表'],
      default: FormTypes.feature,
    },
    relFormId: {
      hidden: '{{ formData.formType !== 2  }}',
      required: '{{ formData.formType === 2  }}',
      title: '关联表单',
      type: 'number',
      widget: CustomWidgetsTypes.mdSimpleSelect,
      selectType: 'form',
    },
    isNeedApprove: {
      hidden: '{{ formData.formType !== 2  }}',
      title: '是否需要审批',
      type: 'boolean',
      widget: 'checkbox',
      default: false,
    },
    formDesc: {
      title: '表单描述',
      type: 'string',
    },
    column: {
      title: '整体布局',
      type: 'number',
      enum: [1, 2, 3],
      enumNames: ['一行一列', '一行二列', '一行三列'],
      props: {
        placeholder: '默认一行一列',
      },
    },
    labelWidth: {
      title: '标签宽度',
      type: 'number',
      widget: 'slider',
      max: 300,
      props: {
        hideNumber: true,
      },
    },
    displayType: {
      title: '标签展示模式',
      type: 'string',
      default: 'row',
      enum: ['row', 'column'],
      enumNames: ['同行', '单独一行'],
      widget: 'radio',
    },
    formDataBind: {
      title: '数据绑定',
      type: 'object',
      widget: CustomWidgetsTypes.mdForm,
    },
    dataLink: {
      title: '数据联动',
      type: 'array',
      widget: CustomWidgetsTypes.mdDataLink,
      items: {
        type: 'object',
      },
    },
  },
};
