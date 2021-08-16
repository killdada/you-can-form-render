import type { FC } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash-es';
import { useModel } from 'umi';

import type { RadioChangeEvent, FormInstance } from 'antd';
import { message } from 'antd';
import { Button, Form, Radio, Select } from 'antd';
import { ModalForm, ProFormDependency } from '@ant-design/pro-form';

import type {
  FormBindData,
  IDataBind,
  TableDataBindSetting,
  TableSettingDataSourceType,
} from '@/types';
import { CustomWidgetsTypes } from '@/types';
import { ERemoteBindType, EDataBindType } from '@/types';

import { systemVarList } from '@/utils';

import { RemoteBindContent } from '../components';
import DataBindField from './Field';

const { Option } = Select;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// 初始的默认值，当切换绑定方式的时候需要重置这些值
const defaultBindData: IDataBind = {
  sourceMethod: undefined,
  field: '',
};

const DataBind: FC<Generator.CustomComponentsProp<IDataBind>> = (props) => {
  const formRef = useRef<FormInstance>();
  const [show, setShow] = useState(false);

  const { getFormSchemaData } = useModel('schemaModel', (model) => ({
    getFormSchemaData: model.getFormSchemaData,
  }));

  const { updateDatabaseParamList, updateThirdDatabaseApiList } = useModel(
    'formModel',
    (model) => ({
      updateDatabaseParamList: model.updateDatabaseParamList,
      updateThirdDatabaseApiList: model.updateThirdDatabaseApiList,
    }),
  );

  const { currentSelectField } = useModel('fieldsModel', (model) => ({
    currentSelectField: model.currentSelectField,
  }));

  const selectId = currentSelectField.$id;
  const isTable = currentSelectField.widget === CustomWidgetsTypes.mrTable;
  // 删减了其他值，只留下需要的值
  const tableColumnData: TableDataBindSetting[] = (
    currentSelectField.columnTableDataBind || []
  ).map((item) => ({
    id: item.id,
    rowTitle: item.rowTitle,
    rowType: item.rowType,
    fieldKey: '',
  }));
  const fieldType = isTable ? 'table' : 'common';
  const editableKeys = tableColumnData.map((item) => item.id);

  const { value } = props;

  // 获取表单配置全局表单绑定接口schema信息
  const { formDataBind = {} as FormBindData } = getFormSchemaData() || {};
  const { databaseTableName, dataSourceMethod } = formDataBind;

  useEffect(() => {
    let fields = {};
    if (!isEmpty(props.value)) {
      if (isTable) {
        // 需要处理下部分数据，数据在表格列已经删除的话，旧的fields是无意义的
        const { field = [] } = props.value;
        const res: TableDataBindSetting[] = [];
        tableColumnData.forEach((item) => {
          const currentField = (field as Partial<TableSettingDataSourceType>[]).find(
            (fieldItem) => fieldItem.id === item.id,
          );
          const fieldKey = currentField ? currentField.fieldKey : '';
          res.push({
            id: item.id,
            rowTitle: item.rowTitle,
            rowType: item.rowType,
            fieldKey,
          });
        });
        fields = {
          ...props.value,
          field: res,
        };
      } else {
        fields = {
          ...props.value,
        };
      }
    } else {
      // 如果表单绑定的是第三方数据，并且bind有数据进行填充
      const bindKey = props.addons.formData.bind;
      let field = dataSourceMethod === ERemoteBindType.thirdDataBase && bindKey ? bindKey : '';
      let sourceMethod =
        dataSourceMethod === ERemoteBindType.database ||
        dataSourceMethod === ERemoteBindType.thirdDataBase
          ? EDataBindType.remote
          : undefined;
      // 如果是table组件也需要主要赋值
      if (isTable) {
        field = tableColumnData;
        // table只允许绑定其他远程接口，不允许和全局表单公用
        sourceMethod = EDataBindType.otherRemote;
      }
      fields = {
        ...defaultBindData,
        sourceMethod,
        field,
      };
    }

    // 当前数据绑定接口配置的信息
    const {
      sourceMethod,
      dataSourceMethod: dataSourceMethodLocal,
      databaseTableName: databaseTableNameLocal,
      appId,
    } = props.value || {};
    // 远程或者刚开始未初始化的时候，只要表单配置了绑定都需要处理更新本地数据库表字段
    if (sourceMethod === EDataBindType.remote || typeof sourceMethod === 'undefined') {
      // 需要根据实际情况获取下字段列表信息
      if (dataSourceMethod === ERemoteBindType.database && databaseTableName) {
        updateDatabaseParamList(databaseTableName);
      }
    } else if (sourceMethod === EDataBindType.otherRemote) {
      // 其他远程情况，自行绑定接口字段，根据实际情况看要不要获取本地数据库字段列表，或者是第三方系统接口列表数据
      if (dataSourceMethodLocal === ERemoteBindType.database && databaseTableNameLocal) {
        updateDatabaseParamList(databaseTableName);
      }
      if (dataSourceMethod === ERemoteBindType.thirdDataBase && appId) {
        updateThirdDatabaseApiList(appId);
      }
    }

    formRef?.current?.setFieldsValue(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(props.value),
    formDataBind.sourceMethod,
    formDataBind.databaseTableName,
    // 当前选中的组件节点更新从新赋值下
    selectId,
  ]);

  const onChangeType = (e: RadioChangeEvent) => {
    // 重置之前的列的值
    const defaultField = isTable && e.target.value !== EDataBindType.system ? tableColumnData : '';
    formRef?.current?.setFieldsValue({ field: defaultField });
  };

  const onFinish = async (values: IDataBind) => {
    if (props.onChange) {
      // 如果是远程接口记得同步下bind字段,这样远程表单接口请求下来，直接使用该表单接口返回的字段进行赋值即可，（id, bind都可以赋值所以可以这样处理，看文档 https://x-render.gitee.io/form-render/advanced/form-methods#%E4%BE%8B-3%EF%BC%9Abind 和 https://x-render.gitee.io/form-render/schema/schema#bind）
      if (!isTable && values.sourceMethod !== EDataBindType.system) {
        props.addons.onItemChange('bind', values.field);
      }
      if (
        isTable &&
        ((values.field || []) as TableDataBindSetting[]).some((item) => !item.fieldKey)
      ) {
        message.warn('请检查表格列数据值绑定key，值绑定key不能为空！');
        return false;
      }
      props.onChange(values);
      setShow(false);
      return true;
    }
    return true;
  };

  return (
    <ModalForm
      visible={show}
      layout="horizontal"
      width="900px"
      title="数据绑定"
      formRef={formRef}
      trigger={
        <Button type="primary" onClick={() => setShow(true)} className="mt16 mb16">
          数据绑定
        </Button>
      }
      onFinish={onFinish}
      onVisibleChange={setShow}
      initialValues={{
        ...value,
      }}
      {...formLayout}
    >
      <Form.Item
        label="取值方式"
        name="sourceMethod"
        tooltip="远程数据是直接绑定表单配置的接口对应的字段，其他远程数据是用户自定义关联其他接口并进行字段绑定，主要是为了支持同一个表单字段的数据来源可以分别来源于多个接口地址。"
        rules={[{ required: true, message: '请选择取值方式' }]}
      >
        <Radio.Group onChange={onChangeType}>
          <Radio value={EDataBindType.remote} disabled={!dataSourceMethod || isTable}>
            远程数据
          </Radio>
          <Radio value={EDataBindType.otherRemote}>其他远程数据</Radio>
          <Radio disabled={isTable} value={EDataBindType.system}>
            系统变量
          </Radio>
        </Radio.Group>
      </Form.Item>
      <ProFormDependency name={['sourceMethod', 'dataSourceMethod']}>
        {({ sourceMethod: sourceMethodLocal, dataSourceMethod: dataSourceMethodLocal }) => {
          if (sourceMethodLocal === EDataBindType.remote) {
            return (
              <DataBindField
                sourceMethod={sourceMethodLocal}
                fieldType={fieldType}
                editableKeys={editableKeys}
                dataSourceMethod={dataSourceMethod}
              ></DataBindField>
            );
          }

          if (sourceMethodLocal === EDataBindType.otherRemote) {
            return (
              <>
                <RemoteBindContent
                  resetFields={{
                    field: isTable ? tableColumnData : '',
                  }}
                  formRef={formRef}
                  type="data"
                ></RemoteBindContent>

                <DataBindField
                  sourceMethod={sourceMethodLocal}
                  fieldType={fieldType}
                  editableKeys={editableKeys}
                  dataSourceMethod={dataSourceMethodLocal}
                ></DataBindField>
              </>
            );
          }

          if (sourceMethodLocal === EDataBindType.system) {
            return (
              <Form.Item
                label="系统变量"
                name="field"
                rules={[{ required: true, message: '请选择系统变量!' }]}
              >
                <Select placeholder="请选择环境变量">
                  {systemVarList.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            );
          }
          return null;
        }}
      </ProFormDependency>
    </ModalForm>
  );
};

export default DataBind;
