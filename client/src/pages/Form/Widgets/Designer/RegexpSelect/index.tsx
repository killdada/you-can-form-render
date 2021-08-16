import type { FC } from 'react';
import React from 'react';
import { Button, Input } from 'antd';

import { commonReg } from '@/utils/regexp';
import type { SelectBindData } from '@/types';

import './index.less';

interface RegProps {
  pattern: string;
  message: string;
  name?: string;
}

const RegexpSelect: FC<Generator.CustomComponentsProp<SelectBindData>> = (props) => {
  const { pattern, message } = props.value || { pattern: '', message: '' };
  // console.log(props, 'props');

  const setValue = (regObj: RegProps) => {
    props.addons.onItemChange('rules', [regObj]);
    props.addons.onItemChange('pattern', regObj);
  };

  const handleBtnClick = (option: RegProps) => {
    const { name, ...res } = option;
    setValue(res);
  };

  const handleRegChange = (name: string, val: string) => {
    const oldValue = { pattern, message };
    const temp = { ...oldValue, [name]: val };
    setValue(temp);
  };

  return (
    <>
      <div className="reg-item">
        {Object.values(commonReg).map((item) => (
          <Button size="small" key={item.name} type="primary" onClick={() => handleBtnClick(item)}>
            {item.name}
          </Button>
        ))}
      </div>
      <Input
        value={pattern}
        addonAfter="正则"
        onChange={(e) => handleRegChange('pattern', e.target.value)}
      />
      <Input
        className="reg-input"
        value={message}
        addonAfter="提示"
        onChange={(e) => handleRegChange('message', e.target.value)}
      />
    </>
  );
};

export default RegexpSelect;
