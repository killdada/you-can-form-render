import type { FC } from 'react';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useModel } from 'umi';
import { useSetState } from 'ahooks';

import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';

import type { FieldsData, IFormula, ModalRef } from '@/types';

import { checkFormula } from '@/utils';
import { message } from 'antd';

interface FormulaProps {
  onFinish: (value: IFormula) => void;
  ref: any;
}

const keyboard: (string | number)[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  '+',
  '-',
  '*',
  '/',
  '(',
  ')',
  '.',
  '清除',
];

const Formula: FC<FormulaProps> = forwardRef<ModalRef<IFormula>, FormulaProps>((props, ref) => {
  const [show, setShow] = useState(false);

  const [formula, setFormula] = useSetState<IFormula>({ label: '', value: '' });

  const { fields } = useModel('fieldsModel', (model) => ({
    fields: model.fields,
  }));

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setFormula(data);
      setShow(true);
    },
  }));

  // 点击公式
  const handleClickField = (item: FieldsData) => {
    setFormula({
      label: formula.label + item.label,
      value: formula.value + item.value,
    });
  };

  // 点击小键盘
  const handleClickSign = (item: string | number) => {
    if (item === '清除') {
      setFormula({
        label: '',
        value: '',
      });
    } else {
      setFormula({
        label: formula.label + item,
        value: formula.value + item,
      });
    }
  };

  const onFinish = async () => {
    // 空字符串不需要检验，直接合法
    if (!formula.value.length || checkFormula(formula.value)) {
      props.onFinish(formula);
      return true;
    }
    message.warn('表达式不合法！');
    return false;
  };

  return (
    <ModalForm
      width="800px"
      title="公式设置"
      visible={show}
      onVisibleChange={setShow}
      validateTrigger="onSubmit"
      layout="horizontal"
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        wrapClassName: 'data-link-modal-formula',
      }}
      onFinish={onFinish}
    >
      <ProCard split="vertical">
        <ProCard
          title="可选字段"
          className="data-link-modal-formula-fields"
          headerBordered
          colSpan="30%"
        >
          <ul>
            {fields.map((item) => {
              return (
                <li onClick={() => handleClickField(item)} key={item.value}>
                  {item.label}
                </li>
              );
            })}
          </ul>
        </ProCard>
        <ProCard title="小键盘" headerBordered className="data-link-modal-formula-keyboard">
          <ul>
            {keyboard.map((item) => {
              return (
                <li key={item} onClick={() => handleClickSign(item)}>
                  {item}
                </li>
              );
            })}
          </ul>
          <ProFormTextArea
            labelAlign="right"
            name="text"
            label="表达式"
            disabled
            fieldProps={{
              value: formula.label || '',
            }}
          />
        </ProCard>
      </ProCard>
    </ModalForm>
  );
});

export default Formula;
