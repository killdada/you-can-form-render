import type { TableColumnComType } from '@/types';

// table组件 列属性权限字段
export const TableColumnEnumProps: Record<TableColumnComType, string[]> = {
  0: ['isShow', 'isMoney'],
  1: ['isShow', 'isRequired', 'isDisabled', 'isMoney'],
  2: ['isShow', 'isDisabled'],
  3: ['isShow', 'isRequired', 'isDisabled'],
  4: ['isShow', 'isRequired', 'isDisabled', 'isMultiple'],
  5: ['isShow', 'isRequired', 'isDisabled'],
};

// table组件 列种类枚举
export const rowTypeMnum: { label: string; value: TableColumnComType }[] = [
  {
    label: '纯文本',
    value: 0,
  },
  {
    label: '输入框',
    value: 1,
  },
  {
    label: '按钮',
    value: 2,
  },
  {
    label: '日期选择器',
    value: 3,
  },
  {
    label: '选择器',
    value: 4,
  },
  {
    label: '时间选择器',
    value: 5,
  },
];

// table组件提示
export const tableComMessage = {
  0: '',
  1: '请输入值！',
  2: '',
  3: '请选择日期！',
  4: '请选择值！',
  5: '请选择时间！',
};

// table rowType对应的组件
export const componentByRowType = {
  0: '',
  1: 'text',
  2: 'text',
  3: 'date',
  4: 'select',
  5: 'time',
};
