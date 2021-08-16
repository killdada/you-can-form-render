import type { FC } from 'react';
import React from 'react';

import { Checkbox } from 'antd';

import type { CustomFormItemProps } from '@/types';

interface ICheckBoxFormItemProps extends CustomFormItemProps<boolean> {
  // checkbox单选的时候文字
  text?: string;
}

// proform 的valueType当时复选框时，默认的值填充的是数组，我们想要的是一个boolean值方便后续判断处理，swtich虽然是boolean但是整体交互不一样，这里处理封装下checkbox，值最终填充为boolean
const CheckBoxFormItem: FC<ICheckBoxFormItemProps> = (props) => {
  const { value, onChange, text = '是', ...other } = props;
  return (
    <Checkbox
      checked={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.checked);
        }
      }}
      {...other}
    >
      {text}
    </Checkbox>
  );
};

export default CheckBoxFormItem;
