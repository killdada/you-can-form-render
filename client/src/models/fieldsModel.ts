import { useCallback, useState, useRef } from 'react';
import { useModel } from 'umi';
import { sortedUniqBy } from 'lodash-es';

import type { Error } from 'form-render';
import type { FieldsData, ISchemaCommonPropsPartial } from '@/types';

import { getAllFields, checkSelectNeedOptions } from '@/utils';

/**
 * @description 根据schema组装处理所有的字段列表信息等
 * @description 数据联动的时候需要使用，删除
 * @description 收集自定义组件的一些检验错误字段信息
 */
export default function useFieldsModel() {
  // 当前选中节点的信息
  const [currentSelectField, setCurrentSelectField] = useState<ISchemaCommonPropsPartial>({});
  const [fields, setFields] = useState<FieldsData[]>([]);
  const { getFormSchemaData } = useModel('schemaModel', (model) => ({
    getFormSchemaData: model.getFormSchemaData,
  }));

  // 错误的字段信息收集，内置的setErrorFields有bug（设置以后每次重新检验导致用户手动设置的被清空），这里自己简单收集下即可 注意用ref处理优化，state频繁会有性能问题
  const errorFieldsRef = useRef<Error[]>([]);

  const setErrorFields = (error: Error[]) => {
    let newErrorFields: Error[] = [];
    const currentErrors = errorFieldsRef.current as Error[];
    if (Array.isArray(error)) {
      newErrorFields = [...currentErrors, ...error];
    } else {
      // console.log('error format is wrong');
    }
    newErrorFields = sortedUniqBy(newErrorFields, (item) => item.name);
    errorFieldsRef.current = newErrorFields;
  };

  const removeErrorField = (path: string) => {
    const newError = errorFieldsRef.current?.filter((item) => {
      return item.name.indexOf(path) === -1;
    });
    errorFieldsRef.current = newError;
  };

  // getFormSchemaData 实时获取一次schema生成最新的fields信息
  const getFields = useCallback(() => {
    const data = getAllFields(getFormSchemaData());
    setFields(data);
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 通过传入的id 检查这个字段是否是类select字段,如果是类select字段返回对应的options
  const checkFieldIsSelect = useCallback(
    (id: string | number | undefined, fieldList?: FieldsData[]) => {
      return checkSelectNeedOptions(id, fieldList || fields);
    },
    [fields],
  );

  return {
    currentSelectField,
    setCurrentSelectField,
    fields,
    getFields,
    removeErrorField,
    errorFieldsRef,
    setErrorFields,
    checkFieldIsSelect,
  };
}
