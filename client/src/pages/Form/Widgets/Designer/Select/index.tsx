import type { FC } from 'react';
import React from 'react';

import type { SelectBindData } from '@/types';
import { RemoteBindModal } from '../components';

const SelectBind: FC<Generator.CustomComponentsProp<SelectBindData>> = (props) => {
  return (
    <RemoteBindModal key={props.addons.formData.$id} {...props} type="select"></RemoteBindModal>
  );
};

export default SelectBind;
