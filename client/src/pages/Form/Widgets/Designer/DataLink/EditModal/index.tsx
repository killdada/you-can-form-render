import type { FC } from 'react';
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useModel } from 'umi';
import { isUndefined } from 'lodash-es';

import type { FormInstance } from 'antd';
import { message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form';

import type { DataLinkAction, DataLinkCondition, ModalRef, DataLinkItem } from '@/types';

import Conditions from './Conditions';
import Actions from './Actions';

interface DataLinkEditModalProps {
  onFinish: (data: DataLinkItem, isEdit: boolean) => void;
  ref: any;
}

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const checkData = (values: DataLinkItem) => {
  if (
    values.conditions?.some(
      (item: DataLinkCondition) =>
        isUndefined(item.field) ||
        isUndefined(item.value) ||
        (typeof item.value === 'string' &&
          !item.value.length &&
          Array.isArray(item.value) &&
          !item.value.length),
    )
  ) {
    // value可能是数组，数组就是多选的包含情况
    message.warn('配置条件信息不全！');
    return false;
  }

  if (values.actions?.some((item: DataLinkAction) => isUndefined(item.field))) {
    message.warn('配置联动信息不全！');
    return false;
  }
  return true;
};

const DataLinkEditModal: FC<DataLinkEditModalProps> = forwardRef<
  ModalRef<DataLinkItem>,
  DataLinkEditModalProps
>((props, ref) => {
  const formRef = useRef<FormInstance>();
  const [editShow, setEditShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataLink, setDataLink] = useState<DataLinkItem>({} as DataLinkItem);

  const onFinish = async (values: DataLinkItem) => {
    if (checkData(values)) {
      props.onFinish({ ...values, id: isEdit ? dataLink.id : Date.now() }, isEdit);
      return true;
    }
    return false;
  };

  const { getFields } = useModel('fieldsModel', (model) => ({
    getFields: model.getFields,
  }));

  useImperativeHandle(ref, () => ({
    open: (data, type) => {
      // 打开弹窗的时候时候更新下组装的fields信息，后续子组件(condition、actions)不需要更新了，直接用
      getFields();
      setDataLink(data);
      setIsEdit(!!type);
      setEditShow(true);
      formRef?.current?.setFieldsValue(data);
    },
  }));

  return (
    <ModalForm
      width="1000px"
      title={isEdit ? '编辑表单联动' : '新建表单联动'}
      formRef={formRef}
      visible={editShow}
      onVisibleChange={setEditShow}
      validateTrigger="onSubmit"
      layout="horizontal"
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        wrapClassName: 'data-link-modal-edit',
      }}
      initialValues={{
        ...dataLink,
      }}
      onFinish={onFinish}
      {...formLayout}
    >
      <ProFormText
        required
        rules={[{ required: true, message: '请输入联动名称!' }]}
        name="name"
        label="联动名称"
        placeholder="请输入联动名称"
      />

      <ProFormRadio.Group
        name="isEnable"
        label="启用状态"
        required
        rules={[
          {
            required: true,
            message: '请选择启用状态!',
            validator: async (_, values) => {
              if (isUndefined(values)) {
                return Promise.reject(new Error('请选择启用状态!'));
              }
              return Promise.resolve();
            },
          },
        ]}
        options={[
          {
            label: '启用',
            value: true,
          },
          {
            label: '禁用',
            value: false,
          },
        ]}
      />

      <ProForm.Item label="配置条件" name="conditions">
        <Conditions></Conditions>
      </ProForm.Item>

      <ProForm.Item
        label="配置联动"
        tooltip="配置了条件的情况下，满足条件才触发这个联动；如果没有配置条件，默认该联动效果也会触发"
        name="actions"
      >
        <Actions></Actions>
      </ProForm.Item>

      <ProFormTextArea name="desc" label="备注" placeholder="请输入备注" />
    </ModalForm>
  );
});

export default DataLinkEditModal;
