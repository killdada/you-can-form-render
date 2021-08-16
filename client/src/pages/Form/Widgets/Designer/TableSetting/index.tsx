import type { FC } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { cloneDeep, get, isEmpty } from 'lodash-es';

import type { FormInstance } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Form, Tooltip } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import { InfoCircleOutlined } from '@ant-design/icons';

import type { SelectBindData, TableDataBindSetting, TableSettingDataSourceType } from '@/types';
import { TableColumnComType } from '@/types';

import { TableColumnEnumProps, rowTypeMnum } from '@/utils';

import { RemoteBindModal, CheckboxBoolean } from '../components';

type rowType = keyof typeof TableColumnEnumProps;

const defaultBindData: Partial<TableSettingDataSourceType> = {
  isDisabled: false,
  isRequired: false,
  isMultiple: false,
  isMoney: false,
  isShow: false,
  optionState: {} as SelectBindData,
};

const TableSetting: FC<Generator.CustomComponentsProp<TableSettingDataSourceType[]>> = (props) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<TableSettingDataSourceType[]>([]);
  const [dataSourceOrigin, setDataSourceOrigin] = useState<TableSettingDataSourceType[]>([]);
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [show, setShow] = useState(false);

  const { value = [] } = props;

  useEffect(() => {
    if (!isEmpty(value)) {
      setDataSource(value);
      setDataSourceOrigin(cloneDeep(value));
      setEditableRowKeys(value.map((item: TableSettingDataSourceType) => item.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // 组件类型切换，还原选项值
  const resetByComChange = (config: { rowKey: string }) => {
    form.setFieldsValue({
      [config.rowKey]: { ...defaultBindData },
    });
  };

  const onFinish = async () => {
    await form.validateFields();
    let field: TableDataBindSetting[] = get(
      props,
      'addons.formData.dataBind.field',
      [],
    ) as TableDataBindSetting[];
    dataSourceOrigin.forEach((item) => {
      if (!dataSource.find((data) => data.id === item.id)) {
        // 该字段已经被删除，如果 dataBind.field有该字段 需要同步更新删除 dataBind.field
        field = field.filter((fieldItem) => fieldItem.id !== item.id);
      }
    });
    props.addons.onItemChange('dataBind.field', field);
    props.onChange(dataSource);
    return true;
  };

  const columns: ProColumns<TableSettingDataSourceType>[] = [
    {
      title: '组件类型',
      key: 'rowType',
      dataIndex: 'rowType',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '参数值是必选项！',
            },
          ],
        };
      },
      valueType: 'select',
      fieldProps: (_, config: { rowKey: string }) => {
        return {
          allowClear: false,
          options: rowTypeMnum,
          onChange: () => resetByComChange(config),
        };
      },
    },
    {
      title: '列头名称',
      key: 'rowTitle',
      dataIndex: 'rowTitle',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '参数值是必填项！',
            },
          ],
        };
      },
    },
    {
      title: '显示',
      key: 'isShow',
      dataIndex: 'isShow',
      renderFormItem: () => {
        return <CheckboxBoolean></CheckboxBoolean>;
      },
    },
    {
      title: '必填',
      key: 'isRequired',
      dataIndex: 'isRequired',
      renderFormItem: ({ key = '' }, { record = {} }) => {
        return (
          <CheckboxBoolean
            disabled={!TableColumnEnumProps[record.rowType as rowType].includes(key as string)}
          ></CheckboxBoolean>
        );
      },
    },
    {
      title: '禁用',
      key: 'isDisabled',
      dataIndex: 'isDisabled',
      renderFormItem: ({ key = '' }, { record = {} }) => {
        return (
          <CheckboxBoolean
            disabled={!TableColumnEnumProps[record.rowType as rowType].includes(key as string)}
          ></CheckboxBoolean>
        );
      },
    },
    {
      title: '多选',
      key: 'isMultiple',
      dataIndex: 'isMultiple',
      renderFormItem: ({ key = '' }, { record = {} }) => {
        return (
          <CheckboxBoolean
            disabled={!TableColumnEnumProps[record.rowType as rowType].includes(key as string)}
          ></CheckboxBoolean>
        );
      },
    },
    {
      title: '金额字段',
      key: 'isMoney',
      dataIndex: 'isMoney',
      renderFormItem: ({ key = '' }, { record = {} }) => {
        return (
          <CheckboxBoolean
            disabled={!TableColumnEnumProps[record.rowType as rowType].includes(key as string)}
          ></CheckboxBoolean>
        );
      },
    },
    {
      title: '选项来源',
      key: 'optionState',
      dataIndex: 'optionState',
      tooltip: '当选择的组件类型为下拉框时，可以开启选择options选项。',
      renderFormItem: (_, { record }) => {
        const { rowType, isMultiple = false, optionState = {} } = record || {};
        const isSelect = rowType === TableColumnComType.select;
        if (isSelect) {
          // 注意剔除掉onChange，不能用外部的fr-generator 提供的onChange，而应该直接用内部的formItem包裹的onChange （内部已经透传了）
          const { onChange, ...other } = props;
          const comPorps = {
            ...other,
            schema: {
              ...other.schema,
              // 注意需要标识是单选还是多选，固定选项的填写的时候需要用到这个字段
              comType: isMultiple ? 'multiple' : 'single',
            },
            value: optionState as SelectBindData,
          };
          return <RemoteBindModal isTable={true} type="select" {...comPorps} />;
        }
        return <></>;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];

  return (
    <ModalForm
      visible={show}
      layout="horizontal"
      width="1400px"
      title={
        <>
          <span className="mr8">每列的配置</span>
          <Tooltip title="每列数据绑定请在数据绑定组件进行绑定。" placement="top">
            <InfoCircleOutlined />
          </Tooltip>
        </>
      }
      onVisibleChange={setShow}
      onFinish={onFinish}
      formRef={formRef}
      trigger={
        <Button type="primary" onClick={() => setShow(true)} className="mt16 mb16">
          表格列配置
        </Button>
      }
    >
      <EditableProTable<TableSettingDataSourceType>
        columns={columns}
        rowKey="id"
        value={dataSource}
        controlled={true}
        actionRef={actionRef}
        onChange={setDataSource}
        bordered
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
            rowType: TableColumnComType.input,
            optionState: {} as SelectBindData,
          }),
          creatorButtonText: '新增一列数据',
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          form,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </ModalForm>
  );
};

export default TableSetting;
