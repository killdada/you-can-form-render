import type { FC } from 'react';
import React from 'react';

import { useModel } from 'umi';
import { Select } from 'antd';

// 简单的一个设计时可以绑定固定远程接口的select下拉选项，比如表单分类选择、审批表的时候关联某个表单选择
const SimpleSelect: FC<Generator.CustomComponentsProp<string | number>> = (props) => {
  const { formCategorys, formList } = useModel('formModel', (model) => ({
    formCategorys: model.formCategorys,
    formList: model.formList,
  }));

  const { selectType = 'category' } = props.schema || {};

  const options: { label: string; value: number }[] | undefined = [];
  if (selectType === 'category') {
    formCategorys.forEach((item) => {
      options.push({
        label: item.categoryName,
        value: item.id,
      });
    });
  } else {
    formList.forEach((item) => {
      options.push({
        label: item.formName,
        value: item.id,
      });
    });
  }

  return (
    <Select
      style={{ width: '100%' }}
      value={props.value}
      options={options}
      onChange={props.onChange}
      showSearch
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    ></Select>
  );
};

export default SimpleSelect;
