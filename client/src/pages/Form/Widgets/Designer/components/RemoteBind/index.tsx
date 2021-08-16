import type { FC } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash-es';
import { useModel } from 'umi';

import type { FormInstance } from 'antd';
import { Button, Modal } from 'antd';
import { ModalForm } from '@ant-design/pro-form';

import type { RemoteBindData, IOptions, BindComponentType, TOptionsType } from '@/types';
import { ERemoteBindType } from '@/types';

import { optionsToEnum } from '@/utils';

import Content from './Content';
import { defaultBindData } from './const';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// type = select的时候，没有绑定来源方式的时候填充默认值
const getDefaultSelectData = (value: RemoteBindData, formData: any, type: BindComponentType) => {
  if (!value?.dataSourceMethod && type === 'select') {
    const { enum: enums = [], enumNames = [] } = formData || {};
    const options: IOptions[] = enums.map((item: string | number, idx: number) => {
      // 直接取相同enumNames 下标作为label，取不到就用这个value当label
      const label = enumNames[idx] || item;
      // 新建生成id的是string,模板setting里面的是number,统一转string，不然后续判断重复的时候类型可能需要额外处理
      return { id: idx.toString(), label, value: item, default: false };
    });

    return {
      dataSourceMethod: ERemoteBindType.fixed,
      options,
    };
  }
  return {};
};

// 修改数据绑定当牵扯到对应接口地址变更的情况下，需要弹窗提示，提醒用户之前绑定的字段手动重新绑定
const checkNeedConfirm = (val: RemoteBindData, originVal?: RemoteBindData) => {
  // 刚开始组件最初原始值为undefined的情况，不需提示
  if (typeof originVal === 'undefined') {
    return false;
  }
  if (val.dataSourceMethod !== originVal.dataSourceMethod) {
    // 数据库来源不同肯定接口不同
    return true;
  }

  if (val.dataSourceMethod === ERemoteBindType.database) {
    // 绑定的表名不同，需要重新绑定
    if (val.databaseTableName !== originVal.databaseTableName) {
      return true;
    }
  }

  if (val.dataSourceMethod === ERemoteBindType.thirdDataBase) {
    // 第三方系统不同，说明接口不同
    if (val.appId !== originVal.appId) {
      return true;
    }
    // 第三方系统接口绑定名称不同，地址不同需要重新绑定
    if (val.appInterId !== originVal.appInterId) {
      return true;
    }
  }
  return false;
};

interface IRemoteBind extends Generator.CustomComponentsPropNoChange<RemoteBindData> {
  /** @description 远程数据绑定组件类型 */
  type: BindComponentType;
  /** @description 是否是table组件 */
  isTable?: boolean;
  /** @description 覆盖掉之前的全局声明的onChange，当该组件作为isTable处理的时候相当于formItem，内部包裹了一层onChange，如果用外部的onChange方法调用错误 */
  onChange?: (value: any) => void;
}

// 大部分情况下发现，先有的字段数据绑定都是绑定到同一个接口地址，很少绑定多个地址，(这里暂时忽略绑定多个接口地址）
const RemoteBindModal: FC<IRemoteBind> = (props) => {
  // console.log(props,'props')
  const formRef = useRef<FormInstance>();
  const [show, setShow] = useState(false);

  // 定义默认值，虽然刚开始传入的value经过泛型 已经有类型了，但是刚开始现在的默认的value
  const {
    value,
    type = 'form',
    addons: { formData },
    isTable = false,
  } = props;

  const title = type === 'form' ? '绑定表单数据来源' : '绑定选项来源';
  // fixoptions应该区分多选单选， TOptionsType single multiple
  const { comType } = props.schema || {};
  const originVal = value;

  const { updateThirdDatabaseApiList, updateDatabaseParamList } = useModel('formModel');

  useEffect(() => {
    // 初始化form值结构
    let fields = {};
    if (!isEmpty(value)) {
      fields = {
        ...value,
      };
    } else {
      const defaultSelectData = isTable ? {} : getDefaultSelectData(value, formData, type);
      fields = {
        ...defaultBindData,
        ...defaultSelectData,
        dataSourceMethod: type === 'select' ? ERemoteBindType.fixed : undefined,
      };
    }

    // 根据实际情况，看要不要更新本地数据库表，或者是第三方接口列表数据
    const { dataSourceMethod, databaseTableName, appId } = value || {};
    if (type === 'select' && dataSourceMethod === ERemoteBindType.database && databaseTableName) {
      updateDatabaseParamList(databaseTableName);
    }
    if (dataSourceMethod === ERemoteBindType.thirdDataBase && appId) {
      updateThirdDatabaseApiList(appId);
    }

    formRef?.current?.setFieldsValue(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 同步更改对应的enum enumNames字段,(固定方式需要，其他方式因为跟实际接口相关，设计时无法拿到数据所有不需要更新)
  const changeSchemaData = (values: RemoteBindData) => {
    const { dataSourceMethod, options = [] } = values;
    if (dataSourceMethod === ERemoteBindType.fixed) {
      const { defaultVal, enumLabel, enumValue } = optionsToEnum(options, comType as TOptionsType);
      props.addons.onItemChange('enumNames', enumLabel);
      props.addons.onItemChange('enum', enumValue);
      props.addons.onItemChange('default', defaultVal);
    } else {
      // 清空默认值， enum enumnames暂不需要清空，不然页面选项都是空白的
      props.addons.onItemChange('default', undefined);
    }
  };

  const onFinshSelect = async (values: RemoteBindData) => {
    setShow(false);
    if (!isTable) {
      changeSchemaData(values);
    }
    if (props.onChange) {
      props.onChange(values);
    }
  };

  const onFinish = async (values: RemoteBindData) => {
    if (type === 'select') {
      onFinshSelect(values);
      return;
    }
    // 对比下originVal，values的值，如果发现 路径接口变了（之前字段绑定了接口字段的一般需要重新绑定），提交的时候给个确认弹窗，提醒用户重新绑定各个字段的值
    const result = checkNeedConfirm(values, originVal);
    if (result) {
      Modal.confirm({
        content: '接口地址更改以后，请检查更新现有表单字段绑定！您确定需要更改配置吗？',
        onOk() {
          setShow(false);
          if (props.onChange) {
            props.onChange(values);
          }
        },
        onCancel() {
          //
        },
      });
    } else {
      setShow(false);
      if (props.onChange) {
        props.onChange(values);
      }
    }
  };

  return (
    <ModalForm
      visible={show}
      layout="horizontal"
      width="900px"
      title={title}
      formRef={formRef}
      trigger={
        <Button
          type={isTable ? 'link' : 'primary'}
          onClick={() => setShow(true)}
          className={isTable ? '' : 'mt16 mb16'}
        >
          {isTable ? '配置' : title}
        </Button>
      }
      onFinish={onFinish}
      onVisibleChange={setShow}
      {...formLayout}
    >
      <Content type={type} formRef={formRef} comType={comType}></Content>
    </ModalForm>
  );
};

export default RemoteBindModal;
