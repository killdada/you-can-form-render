import type { FC } from 'react';
import React from 'react';
import { useModel } from 'umi';

import type { ProColumns } from '@ant-design/pro-table';
import { Form, Input, Select } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';

import type { IDataBaseParams, TableDataBindSetting } from '@/types';
import { TableColumnComType } from '@/types';
import { ERemoteBindType, EDataBindType } from '@/types';

import { varReg } from '@/utils';

const { Option } = Select;

interface IDataBindField {
  /** @description 当前选中的数据库来源方式 */
  dataSourceMethod?: ERemoteBindType;
  /** @description 当前选中字段的类型，如果是table需要给每一个列进行绑定 */
  fieldType?: 'common' | 'table';
  /** @description 如果是table组件展开列所有的key,标识所有的列可编辑，（因为不想过多控制EditableProTable，如果需要时间这个可以不用，EditableProTable直接适配也可以） */
  editableKeys?: any[];
  /** @description 数据绑定方式 */
  sourceMethod?: EDataBindType;
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

// 数据绑定组件绑定接口以后，需要对字段进行关联
const DataBindField: FC<IDataBindField> = ({
  dataSourceMethod,
  fieldType = 'common',
  editableKeys = [],
  sourceMethod = EDataBindType.remote,
}) => {
  const { databaseParamList } = useModel('formModel', (model) => ({
    databaseParamList: model.databaseParamList,
  }));

  const columns: ProColumns<TableDataBindSetting>[] = [
    {
      title: '列名称',
      dataIndex: 'rowTitle',
      fieldProps: {
        disabled: true,
      },
    },
    {
      title: '绑定值的key',
      dataIndex: 'fieldKey',
      formItemProps: () => {
        const rules: any[] = [
          {
            required: true,
            message:
              dataSourceMethod === ERemoteBindType.thirdDataBase
                ? '绑定值的key是必填项！'
                : '绑定值的key是必选项！',
          },
        ];
        // 第三方系统手动输入key的话需要检验是一个合法变量
        if (dataSourceMethod === ERemoteBindType.thirdDataBase) {
          rules.push({
            pattern: varReg,
            message: '必须是合法变量！',
          });
        }
        return {
          rules,
        };
      },
      renderFormItem: (data: any) => {
        // button无需绑定字段
        if ((data?.entry as TableDataBindSetting).rowType === TableColumnComType.button) {
          return <></>;
        }

        if (dataSourceMethod === ERemoteBindType.database) {
          return (
            <Select showSearch optionFilterProp="children">
              {databaseParamList.map((item: IDataBaseParams) => (
                <Option value={item.paramName} key={item.paramName}>
                  {item.paramComment}
                </Option>
              ))}
            </Select>
          );
        }

        return <Input />;
      },
    },
  ];

  if (fieldType === 'table' && typeof dataSourceMethod !== 'undefined') {
    // sourceMethod 本地远程不允许绑定，一般全局表单接口不会单独给table用
    if (sourceMethod === EDataBindType.remote) return <></>;
    return (
      <Form.Item
        label="列字段绑定"
        tooltip="字段类型是按钮不需要绑定key."
        name="field"
        trigger="onValuesChange"
        {...formItemLayout}
      >
        <EditableProTable<TableDataBindSetting>
          rowKey="id"
          bordered
          toolBarRender={false}
          columns={columns}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: () => {
              return [];
            },
          }}
        />
      </Form.Item>
    );
  }

  if (dataSourceMethod === ERemoteBindType.database) {
    return (
      <Form.Item
        label="展示字段"
        name="field"
        rules={[{ required: true, message: '请选择展示字段!' }]}
      >
        <Select showSearch optionFilterProp="children">
          {databaseParamList.map((item: IDataBaseParams) => (
            <Option value={item.paramName} key={item.paramName}>
              {item.paramComment}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  }

  if (dataSourceMethod === ERemoteBindType.thirdDataBase) {
    return (
      <Form.Item
        label="展示字段值"
        name="field"
        rules={[
          { required: true, message: '请输入展示字段!' },
          { pattern: varReg, message: '必须是合法变量！' },
        ]}
      >
        <Input />
      </Form.Item>
    );
  }

  return <></>;
};

export default DataBindField;
