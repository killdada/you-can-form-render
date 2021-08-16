import { useCallback, useState, useRef } from 'react';
import { useBoolean } from 'ahooks';
import { isEqual, pickBy, isUndefined, get } from 'lodash-es';

import { message } from 'antd';

import { checkDesignForm } from '@/utils';
import { FormService } from '@/service';
import type { IFormConfig } from '@/types';

// schema初始化，保存提交等
export default function useSchemaModel() {
  const [loading, { setTrue, setFalse }] = useBoolean(true);
  // 该ref的功能有待商榷，直接返回该ref不知道会不会带来其他性能瓶颈,只是为了子组件拿根父组件的Generator实列，实列里面的实时方法属性而已，或者考虑直接在父级 provider context等
  const generatorRef = useRef<Generator.GenRef>(null);

  // schema目前没有实时同步，用generatorRef.current.getValue可以实时获取值
  const [schema, setSchema] = useState<Record<string, unknown> | undefined>();
  // 运行时表单接口的整体全量数据，包括配置信息和业务信息
  const [formBusinessData, setFormBusinessData] = useState<IFormConfig>({} as IFormConfig);

  const fetchFormSchema = async (id: string, type: 'run' | 'design' = 'design') => {
    setTrue();
    // const { data } = await FormService.fetchFormSchema(id);
    const initFunc = type === 'design' ? FormService.getDesignForm : FormService.getFormConfig;
    const { data = {} } = await initFunc(id);
    const fileText = get(data, 'formPage.fileText', '');
    setSchema(JSON.parse(fileText));
    // 运行时全量保存下接口返回的数据，以前的旧接口把数据统一返回到一个接口了
    if (type === 'run') {
      setFormBusinessData(data as IFormConfig);
    }
    setFalse();
    return data;
  };

  // 实时获取schema数据,key数据的key
  const getFormSchemaData = useCallback((key?: string): any => {
    // generatorRef.current.getValue 内置方法可能会返回一些undefined值，导致后续的isEqual对比出现问题，这里需要过滤
    const value = pickBy(
      generatorRef.current && generatorRef.current.getValue(),
      (valueData: any) => !isUndefined(valueData),
    );
    return key && value ? value[key] : value;
  }, []);

  const saveSchemaData = useCallback(
    async (id: string, schemaData?: any) => {
      const value = schemaData || getFormSchemaData();
      if (isEqual(value, schema)) {
        message.warn('配置并未更改！');
        return;
      }

      const { result, msg, data } = checkDesignForm(value, schema);
      if (!result) {
        message.warn(msg);
        return;
      }

      const isEdit: boolean = typeof id !== 'undefined';
      if (isEdit) {
        await FormService.updateForm({
          id,
          ...data,
        });
      } else {
        await FormService.addForm(data);
      }

      setSchema(value);
      // await FormService.saveFormSchema(id, value);

      message.success(isEdit ? '表单配置更新成功！' : '新增表单配置成功');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema],
  );

  const initFormSchema = useCallback(async (id: string, type: 'run' | 'design' = 'design') => {
    const data = await fetchFormSchema(id, type);
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 方便从全量数据里面去，lodash.get
  const getFormBusinessDataByKey = useCallback(
    (key: string, defalutVal: any) => {
      return get(formBusinessData, key, defalutVal);
    },
    [formBusinessData],
  );

  return {
    loading,
    schema,
    formBusinessData,
    getFormBusinessDataByKey,
    generatorRef,
    initFormSchema,
    saveSchemaData,
    getFormSchemaData,
  };
}
