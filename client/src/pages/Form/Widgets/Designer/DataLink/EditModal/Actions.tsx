import type { FC } from 'react';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useModel } from 'umi';

import { Input, Select, Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';

import { EMathSign } from '@/types';
import type {
  CustomFormItemProps,
  DataLinkAction,
  MathSign,
  MathSignText,
  ModalRef,
  IFormula,
} from '@/types';

import Formula from './Formula';
import { CheckboxBoolean } from '../../components';

const { Option } = Select;

const signOptions: Record<MathSign, { text: MathSignText; status: MathSign }> = {} as any;
Object.keys(EMathSign).forEach((item) => {
  signOptions[item as MathSign] = {
    text: EMathSign[item as MathSign] as MathSignText,
    status: item as MathSign,
  };
});

const DataLinkEditAction: FC<CustomFormItemProps<DataLinkAction[]>> = ({
  value = [],
  onChange,
}: CustomFormItemProps<DataLinkAction[]>) => {
  const formulaRef = useRef<ModalRef<IFormula>>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    value.map((item) => item.id),
  );

  const { fields, checkFieldIsSelect } = useModel('fieldsModel', (model) => ({
    checkFieldIsSelect: model.checkFieldIsSelect,
    // 后续考虑可以过滤部分跟远程数据相关的类select选项标识他们不能选择该字段
    fields: model.fields,
  }));

  const columns = useMemo(() => {
    const data: ProColumns<DataLinkAction>[] = [
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
        title: 'options选项',
        dataIndex: 'options',
        width: '120px',
        tooltip:
          '如果是类select类型并且绑定数据来源为远程，设计时可能无法获取值对应的select,因为对应的请求可能依赖运行时环境，这里暂不支持远程数据来源下拉选择值！',
        renderFormItem: (_, { record }) => {
          const { result, options = [] } = checkFieldIsSelect(record?.field);
          if (result && options.length) {
            return (
              <Select mode="multiple" placeholder="请选择options选项">
                {options.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          }
          return <></>;
        },
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        renderFormItem: () => {
          return <CheckboxBoolean text="启用"></CheckboxBoolean>;
        },
      },
      {
        title: '可见性',
        dataIndex: 'isVisible',
        renderFormItem: () => {
          return <CheckboxBoolean text="显示"></CheckboxBoolean>;
        },
      },
      {
        title: '必填状态',
        dataIndex: 'isRequired',
        renderFormItem: () => {
          return <CheckboxBoolean text="必填"></CheckboxBoolean>;
        },
      },
      {
        title: '清空',
        tooltip: '不满足上面的配置条件时，是否需要清空这个字段的值!',
        dataIndex: 'isClear',
        renderFormItem: () => {
          return <CheckboxBoolean></CheckboxBoolean>;
        },
      },
      {
        title: '值',
        dataIndex: 'formula',
        renderFormItem: (_, { record }) => {
          if (record) {
            const { formula = { label: '', value: '' }, field, id } = record;
            const { result } = checkFieldIsSelect(field);
            if (result) return <></>;
            return (
              <div className="flex-between-center">
                <Input disabled value={formula.label} />
                <Button
                  size="small"
                  className="color-blue"
                  type="text"
                  onClick={() => {
                    formulaRef.current?.open({ ...formula, id } as IFormula);
                  }}
                >
                  FX
                </Button>
              </div>
            );
          }
          return <></>;
        },
      },
      {
        title: '操作',
        valueType: 'option',
      },
    ];
    return data;
  }, [checkFieldIsSelect, fields]);

  const onFinish = useCallback(
    ({ id, ...other }: IFormula) => {
      if (id) {
        const data = value.map((item) => {
          const list = { ...item };
          if (item.id === id) {
            list.formula = other;
          }
          return list;
        });
        if (onChange) {
          onChange(data);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('请检查代码，当前公式列id不确定！');
      }
    },
    [onChange, value],
  );

  return (
    <>
      <EditableProTable<DataLinkAction>
        rowKey="id"
        bordered
        value={value}
        controlled={true}
        onValuesChange={onChange}
        toolBarRender={false}
        columns={columns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => {
            return {
              id: Date.now(),
              isEnable: true,
              isVisible: true,
              isRequired: true,
              isClear: false,
            } as DataLinkAction;
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
      <Formula ref={formulaRef} onFinish={onFinish}></Formula>
    </>
  );
};

export default DataLinkEditAction;
