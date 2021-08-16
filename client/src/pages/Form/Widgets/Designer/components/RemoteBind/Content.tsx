import type { FC } from 'react';
import React from 'react';
import { useModel } from 'umi';

import type { FormInstance } from 'antd';
import { Form, Radio, Input, Select } from 'antd';
import { ProFormDependency } from '@ant-design/pro-form';

import type {
  IDataBase,
  IThirdDataBase,
  IThirdDataBaseApis,
  IDataBaseParams,
  BindComponentType,
  TOptionsType,
} from '@/types';
import { ERemoteBindType } from '@/types';

import { varReg } from '@/utils';

import QueryConditions from './QueryConditions';
import FixedOptions from './FixedOptions';
import { defaultBindData } from './const';

const { Option } = Select;

const formQueryItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

interface IRemoteBind {
  /** @description 该组件是作为多个formItem的集合体，切换数据来源方的时候可能需要重置清空一些其他组件form的值 */
  resetFields?: Record<string, any>;
  /** @description 固定options应该区分单选，和多选 */
  comType?: TOptionsType;
  /** @description 组件的类型 form 表单配置页数据绑定接口; select select组件绑定options数据来源;data 数据组件绑定接口和对应的字段 */
  type: BindComponentType;
  /** @description 上层包裹的formRef */
  formRef: React.MutableRefObject<FormInstance<any> | undefined>;
}

const RemoteBindContent: FC<IRemoteBind> = ({
  type = 'form',
  comType,
  formRef,
  resetFields = {},
}) => {
  const {
    databaseList,
    databaseParamList,
    thirdDatabaseList,
    thirdDatabaseApiList,
    updateThirdDatabaseApiList,
    updateDatabaseParamList,
  } = useModel('formModel', (model) => ({
    databaseList: model.databaseList,
    databaseParamList: model.databaseParamList,
    thirdDatabaseList: model.thirdDatabaseList,
    thirdDatabaseApiList: model.thirdDatabaseApiList,
    updateThirdDatabaseApiList: model.updateThirdDatabaseApiList,
    updateDatabaseParamList: model.updateDatabaseParamList,
  }));

  const onChangeType = () => {
    formRef?.current?.setFieldsValue({ ...defaultBindData, ...resetFields });
  };

  const changeDataBase = async (tableName: string) => {
    // 表单数据绑定不需要马上绑定字段
    if (type === 'form') return;
    await updateDatabaseParamList(tableName);
  };

  const changeThirdDataBase = async (val: string | number) => {
    await updateThirdDatabaseApiList(val);
    formRef?.current?.setFieldsValue({ appInterId: '', appInterAddr: '' });
  };

  const changeThirdSelectInter = (val: string | number) => {
    const data = thirdDatabaseApiList.find((item: IThirdDataBaseApis) => item.id === val);
    formRef?.current?.setFieldsValue({ appInterAddr: data?.interfaceUrl || '' });
  };

  return (
    <>
      {/* 跟之前的绑定关系保持一致，（其实可以优化之前的绑定处理，但是需要接口配合额外返回一些字段信息），优化点 1：选点接口以后需要的查询参数自动带出 （不需要额外查接口文档）优化点 2:： 选择第三方系统的时候现在无法绑定字段可供选择，还需要用户输入字段也不是很友好 */}
      <Form.Item
        label="数据来源方式"
        name="dataSourceMethod"
        rules={[{ required: true, message: '请选择数据来源方式' }]}
      >
        <Radio.Group onChange={onChangeType}>
          {type === 'select' ? <Radio value={ERemoteBindType.fixed}>固定项</Radio> : null}
          <Radio value={ERemoteBindType.database}>数据库来源表</Radio>
          <Radio value={ERemoteBindType.thirdDataBase}>第三方系统来源表</Radio>
        </Radio.Group>
      </Form.Item>
      <ProFormDependency name={['dataSourceMethod']}>
        {({ dataSourceMethod: sourceMethod }) => {
          if (sourceMethod === ERemoteBindType.fixed) {
            return (
              <Form.Item
                label="固定Options项"
                name="options"
                rules={[{ required: true, message: '固定选项不能为空!' }]}
              >
                <FixedOptions type={comType as TOptionsType}></FixedOptions>
              </Form.Item>
            );
          }
          if (sourceMethod === ERemoteBindType.database) {
            return (
              <>
                <Form.Item
                  label="数据来源表"
                  name="databaseTableName"
                  rules={[{ required: true, message: '请选择数据来源表!' }]}
                >
                  <Select onChange={changeDataBase} showSearch optionFilterProp="children">
                    {databaseList.map((item: IDataBase) => (
                      <Option value={item.tableName} key={item.tableName}>
                        {item.tableComment}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {type === 'select' ? (
                  <>
                    <Form.Item
                      label="展示字段名"
                      name="label"
                      rules={[{ required: true, message: '请选择展示字段名!' }]}
                    >
                      <Select showSearch optionFilterProp="children">
                        {databaseParamList.map((item: IDataBaseParams) => (
                          <Option value={item.paramName} key={item.paramName}>
                            {item.paramComment}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="展示字段值"
                      name="value"
                      rules={[{ required: true, message: '请选择展示字段值!' }]}
                    >
                      <Select showSearch optionFilterProp="children">
                        {databaseParamList.map((item: IDataBaseParams) => (
                          <Option value={item.paramName} key={item.paramName}>
                            {item.paramComment}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                ) : null}
                <Form.Item label="查询条件" name="queryConditions" {...formQueryItemLayout}>
                  <QueryConditions></QueryConditions>
                </Form.Item>
              </>
            );
          }

          if (sourceMethod === ERemoteBindType.thirdDataBase) {
            return (
              <>
                <Form.Item
                  label="第三方系统"
                  name="appId"
                  rules={[{ required: true, message: '请选择第三方系统!' }]}
                >
                  <Select onChange={changeThirdDataBase} showSearch optionFilterProp="children">
                    {thirdDatabaseList.map((item: IThirdDataBase) => (
                      <Option value={item.id} key={item.id}>
                        {item.appName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="接口名称"
                  name="appInterId"
                  rules={[{ required: true, message: '请选择接口名称!' }]}
                >
                  <Select onChange={changeThirdSelectInter} showSearch optionFilterProp="children">
                    {thirdDatabaseApiList.map((item: IThirdDataBaseApis) => (
                      <Option value={item.id} key={item.id}>
                        {item.interfaceName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {type === 'select' ? (
                  <>
                    <Form.Item
                      label="展示字段名"
                      name="label"
                      rules={[
                        { required: true, message: '请输入展示字段名!' },
                        { pattern: varReg, message: '必须是合法变量！' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="展示字段值"
                      name="value"
                      rules={[
                        { required: true, message: '请输入展示字段值!' },
                        { pattern: varReg, message: '必须是合法变量！' },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </>
                ) : null}
                <Form.Item label="查询条件" name="queryConditions" {...formQueryItemLayout}>
                  <QueryConditions></QueryConditions>
                </Form.Item>
              </>
            );
          }
          return null;
        }}
      </ProFormDependency>
    </>
  );
};

export default RemoteBindContent;
