import type { FC } from 'react';
import React from 'react';

import type { FormBindData } from '@/types';
import { RemoteBindModal } from '../components';

const FormBind: FC<Generator.CustomComponentsProp<FormBindData>> = (props) => {
  return <RemoteBindModal {...props} type="form"></RemoteBindModal>;
};

export default FormBind;
