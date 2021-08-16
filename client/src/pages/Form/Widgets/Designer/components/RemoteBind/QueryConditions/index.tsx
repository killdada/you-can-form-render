import type { FC } from 'react';
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

import { Form, Input, Select } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';

import type { QueryConditionsVal, CustomFormItemProps, QueryConditionsRef } from '@/types';
import { QueryConditionsValMethod } from '@/types';

import { varReg, systemVarList } from '@/utils';
import { getCheckValRepeatRule } from '../utils';

import './index.less';

const { Option } = Select;

type ProSchemaValueEnumMap = Record<QueryConditionsValMethod, { text: string }>;

const QueryConditionsMethodOptions: ProSchemaValueEnumMap = {
  fixed: { text: '固定值' },
  url: { text: 'url参数' },
  field: { text: '页面字段' },
  system: { text: '系统变量' },
};

// 自定义表单控件，处理表单绑定接口、select等下拉框绑定接口需要的查询参数
const QueryConditions: FC<CustomFormItemProps<QueryConditionsVal[]>> = forwardRef<
  QueryConditionsRef,
  CustomFormItemProps<QueryConditionsVal[]>
>(({ value = [], onChange }: CustomFormItemProps<QueryConditionsVal[]>, ref) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<QueryConditionsVal[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  useImperativeHandle(ref, () => ({
    // 该clear方法手动清除数据，暂时保留，实际暂时不需要使用，（切换数据绑定方式的时候只要把该组件包裹一层就不需要调用该方法了）
    clear: () => {
      setDataSource([]);
    },
  }));

  // 删除一行参数
  const deleteDataSource = (record: QueryConditionsVal) => {
    const data = dataSource.filter((item) => item.id !== record.id);
    setDataSource(data);
    // 别忘记清下对应正在编辑的editkeys
    setEditableRowKeys(editableKeys.filter((item) => item !== record.id));
    if (onChange) {
      onChange(data);
    }
  };

  const columns: ProColumns<QueryConditionsVal>[] = [
    {
      title: '参数名称',
      key: 'name',
      dataIndex: 'name',
      width: 120,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '参数名称是必填项！',
            },
            {
              pattern: varReg,
              message: '必须是合法变量！',
            },
            getCheckValRepeatRule<QueryConditionsVal>({
              dataSource,
              key: 'name',
              message: '参数名称',
            }),
          ],
        };
      },
    },
    {
      title: '参数类型',
      key: 'type',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        string: { text: 'string' },
        number: { text: 'number' },
      },
      width: 110,
      fieldProps: () => ({ allowClear: false }),
    },
    {
      title: '取值方式',
      key: 'method',
      dataIndex: 'method',
      width: 110,
      render: (text) => {
        return <div>{QueryConditionsMethodOptions[text as QueryConditionsValMethod].text}</div>;
      },
      renderFormItem: (schema) => {
        return (
          <Select
            placeholder="请选择取值方式"
            onChange={() => {
              form.setFieldsValue({ [(schema as any).entry.id]: { value: '' } });
            }}
          >
            {Object.keys(QueryConditionsMethodOptions).map((key: string) => {
              return (
                <Option value={key} key={key}>
                  {QueryConditionsMethodOptions[key as QueryConditionsValMethod].text || ''}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '参数值',
      dataIndex: 'value',
      width: 120,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '参数值是必填项！',
            },
          ],
          shouldUpdate: true,
        };
      },
      renderFormItem: (_, { record }) => {
        // 页面字段暂不处理，后续再看下实际情况
        if (record?.method === QueryConditionsValMethod.field) {
          return (
            <Select placeholder="请选择本页面字段">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          );
        }
        if (record?.method === QueryConditionsValMethod.system) {
          return (
            <Select placeholder="请选择系统变量">
              {systemVarList.map((item) => (
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
      title: '必要条件',
      key: 'required',
      dataIndex: 'required',
      valueType: 'switch',
      width: 80,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a key="delete" onClick={() => deleteDataSource(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <div className="query-conditions-container">
      <EditableProTable<QueryConditionsVal>
        rowKey="id"
        bordered
        maxLength={10}
        actionRef={actionRef}
        recordCreatorProps={{
          // newRecordTypee如果是默认值，会导致新增一行保存的时候丢失id，官方组件demo也有这个问题id都没有拼接到dataSource
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => {
            const id = (Math.random() * 1000000).toFixed(0);
            return {
              id,
              type: 'string',
              method: QueryConditionsValMethod.fixed,
              name: '',
              value: '',
              required: false,
            };
          },
        }}
        columns={columns}
        request={async () => ({
          data: value,
          total: value.length,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          form,
          onChange: setEditableRowKeys,
          onSave: async (id, data) => {
            // 调用组件对应的 onChange方法更新到父级
            const result: QueryConditionsVal[] = dataSource.map((item: QueryConditionsVal) => {
              let list = { ...item };
              if (item.id === id) {
                list = {
                  ...item,
                  ...data,
                };
              }
              return list;
            });
            if (onChange) {
              onChange(result);
            }
          },
          actionRender: (record, config, dom) => {
            return [
              dom.save,
              // 不需要默认delete的删除弹窗确认
              <a key="delete" onClick={() => deleteDataSource(record)}>
                删除
              </a>,
            ];
          },
        }}
      />
    </div>
  );
});

export default QueryConditions;
