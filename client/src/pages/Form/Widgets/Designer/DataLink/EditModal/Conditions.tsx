import type { FC } from 'react';
import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';

import { Input, Select } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';

import { EMathSign } from '@/types';
import type { CustomFormItemProps, DataLinkCondition, MathSign, MathSignText } from '@/types';

const { Option } = Select;

const signOptions: { value: MathSign; label: MathSignText }[] = [];
Object.keys(EMathSign).forEach((item) => {
  signOptions.push({
    label: EMathSign[item as MathSign],
    value: item as MathSign,
  });
});

const DataLinkEditCondition: FC<CustomFormItemProps<DataLinkCondition[]>> = ({
  value = [],
  onChange,
}: CustomFormItemProps<DataLinkCondition[]>) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    value.map((item) => item.id),
  );

  const { fields, checkFieldIsSelect } = useModel('fieldsModel', (model) => ({
    checkFieldIsSelect: model.checkFieldIsSelect,
    // 后续考虑可以过滤部分跟远程数据相关的类select选项标识他们不能选择该字段
    fields: model.fields,
  }));

  const columns = useMemo(() => {
    const data: ProColumns<DataLinkCondition>[] = [
      {
        title: '组合方式',
        dataIndex: 'combine',
        valueType: 'select',
        width: '120px',
        valueEnum: {
          and: { text: '与(And)', status: 'and' },
          or: { text: '或(Or)', status: 'or' },
        },
        fieldProps: (form, config) => {
          return {
            // 第一项永远都是and并且不可编辑
            disabled: config.rowIndex === 0,
            allowClear: false,
          };
        },
      },
      {
        title: '字段名称',
        dataIndex: 'field',
        width: '120px',
        valueType: 'select',
        fieldProps: {
          options: fields,
          allowClear: false,
        },
      },
      {
        title: '比较值',
        dataIndex: 'sign',
        valueType: 'select',
        fieldProps: {
          allowClear: false,
          options: signOptions,
        },
        width: '120px',
      },
      {
        title: '值类型',
        dataIndex: 'type',
        valueType: 'select',
        tooltip: '如果是类select类型不需要指定值类型！',
        valueEnum: {
          string: { text: '字符', status: 'string' },
          number: { text: '数字', status: 'number' },
          boolean: { text: '布尔', status: 'boolean' },
        },
        fieldProps: (form, config: { entry: DataLinkCondition; [key: string]: any }) => {
          const { field = '' } = config.entry || {};
          const { result } = checkFieldIsSelect(field);
          return {
            allowClear: false,
            disabled: result,
          };
        },
        width: '120px',
      },
      {
        title: '值',
        dataIndex: 'value',
        tooltip:
          '如果是类select类型并且绑定数据来源为远程，设计时可能无法获取值对应的select,因为对应的请求可能依赖运行时环境，这里暂不支持远程数据来源下拉选择值！',
        renderFormItem: (_, { record }) => {
          const { result, options = [], mode } = checkFieldIsSelect(record?.field);
          if (result && options.length) {
            return (
              <Select placeholder="请选择值" mode={mode === 'multiple' ? 'multiple' : undefined}>
                {options.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          }
          return <Input />;
        },
      },
      {
        title: '操作',
        valueType: 'option',
      },
    ];
    return data;
  }, [checkFieldIsSelect, fields]);

  return (
    <EditableProTable<DataLinkCondition>
      rowKey="id"
      bordered
      value={value}
      controlled={true}
      onValuesChange={(values) => {
        const data: DataLinkCondition[] = values.map((item, index) => {
          const list = { ...item };
          // 删除的情况下，保证第一项始终是and
          if (index === 0) {
            list.combine = 'and';
          }
          return list;
        });
        if (onChange) {
          onChange(data);
        }
      }}
      toolBarRender={false}
      columns={columns}
      recordCreatorProps={{
        newRecordType: 'dataSource',
        position: 'bottom',
        record: () => {
          return {
            id: Date.now(),
            combine: 'and',
            sign: '===',
            type: 'string',
          } as DataLinkCondition;
        },
      }}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableRowKeys,
        actionRender: (row, _, dom) => {
          return [dom.delete];
        },
      }}
    />
  );
};

export default DataLinkEditCondition;
