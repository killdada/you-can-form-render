import React, { useEffect } from 'react';
import { useParams, useModel } from 'umi';

import { Spin } from 'antd';

// 大部分请求shcema信息组件在根组件都有ref（如果不需要ref，或者不需要loading那么可以不需要这个组件），如果loading提前返回会导致 ref 始终为空，useRef返回的实列始终是同一个，这里用这个包裹一层，避免ref为空
const useSchema = (Component: any, type: 'design' | 'run' | undefined = 'design') => {
  const { id } = useParams<{ id: string }>();
  // 表单页面是新增还是编辑
  const isEdit: boolean = typeof id !== 'undefined';

  const { loading, initFormSchema } = useModel('schemaModel', (model) => ({
    initFormSchema: model.initFormSchema,
    loading: model.loading,
  }));

  const { setIsDesignFalse, setIsDesignTrue } = useModel('configModel', (model) => ({
    setIsDesignFalse: model.setIsDesignFalse,
    setIsDesignTrue: model.setIsDesignTrue,
  }));

  useEffect(() => {
    // 标识运行时、设计时
    if (type === 'run') {
      setIsDesignFalse();
    } else {
      setIsDesignTrue();
    }
  }, [setIsDesignFalse, setIsDesignTrue, type]);

  useEffect(() => {
    if (isEdit) {
      initFormSchema(id, type);
    }
  }, [id, initFormSchema, isEdit, type]);

  if (loading && isEdit) return <Spin size="large" tip="加载表单Schema配置中......" />;

  return <Component id={id} isEdit={isEdit}></Component>;
};

export default useSchema;
