import { isUndefined } from 'lodash-es';
import type { IFlattenItem, FieldsData, SelectBindData, IOptions, TOptionsType } from '@/types';
import { ERemoteBindType } from '@/types';
import { selectTypes, selectMultipleTypes } from '@/constants';
import { flattenSchema, getKeyFromUniqueId, getArray } from './tool';

/**
 * @param {*} schema 当前schema （实时的）
 * @param {*} flatten 扁平化的结构，如果有那么直接用，不需要内部再转换
 * @returns 当前表单的所有的字段
 */
export function getAllFields(schemaData: any, flatten?: IFlattenItem) {
  const flattenData: IFlattenItem = flatten || flattenSchema(schemaData) || {};
  const ids = Object.keys(flattenData);
  const result: FieldsData[] = [];
  ids.forEach((item: string) => {
    if (item === '#') return;
    const id = getKeyFromUniqueId(item) || '';
    if (id) {
      const data = flattenData[item];
      const { schema } = data;
      result.push({
        ...data,
        label: schema.title || '',
        value: id,
      });
    }
  });
  return result;
}

/**
 * @description 检查当前传入的字段id是否是select类型并返回相应数据
 * @param {(string | number | undefined)} id 传入的当前字段id
 * @param {FieldsData[]} fields  所有的配置字段信息数组
 * @param {IFlattenItem} flatten  可选参数，schema扁平化后的结构
 * @returns { options?: IOptions[]; result: boolean; mode?: TOptionsType } result 检验结果，mode select类型，options最后需要的select选项
 */
export function checkSelectNeedOptions(
  id: string | number | undefined,
  fields: FieldsData[],
  flatten?: IFlattenItem,
): { options?: IOptions[]; result: boolean; mode?: TOptionsType } {
  if (typeof id === 'undefined') return { result: false };
  const fieldsArr = flatten ? getAllFields({}, flatten) : fields;
  const fieldItem: FieldsData | undefined = fieldsArr.find((item) => item.value === id);
  let need = false;
  let mode: TOptionsType = 'single';
  let options: IOptions[] = [];
  // 如果当前选中的字段是select等字段，值类型是不可编辑的，即使编辑了也不应生效
  if (fieldItem) {
    const {
      widget,
      enumDataBind = {} as SelectBindData,
      enum: enums = [],
      enumNames = [],
      default: defaultVal,
    }: {
      widget: string;
      enumDataBind: SelectBindData;
      enum: any[];
      enumNames: any[];
      default: any;
    } = fieldItem.schema;
    if (widget && selectTypes.includes(widget)) {
      need = true;
      if (selectMultipleTypes.includes(widget)) {
        mode = 'multiple';
      }
      if (isUndefined(enumDataBind.dataSourceMethod)) {
        // 刚开始拖拽过去，未定义的时候，需要拼接处理enums,enumNames
        options = getArray(enums).map((item, idx) => {
          const label = enumNames && Array.isArray(enumNames) ? enumNames[idx] : item;
          const isDefault =
            mode === 'multiple' ? (defaultVal || []).includes(item) : defaultVal === item;
          return { label, value: item, id: idx, default: isDefault };
        });
      } else if (enumDataBind.dataSourceMethod === ERemoteBindType.fixed) {
        // 只处理返回固定参数，远程数据搬到查询条件可能依赖运行时结果导致无法获取。
        options = enumDataBind.options || [];
      }
    }
  }
  return {
    result: need,
    options,
    mode,
  };
}

/**
 * @description 目前fr-generator删除的时候没有任何回调，我们通过判断新旧字段列表对比，返回那些被删除了的字段id
 * @param {FieldsData[]} [fields=[]] 新的fields字段信息
 * @param {FieldsData[]} [oldFields=[]] 旧的fields字段信息
 * @return {*}  {((string | number)[])}
 */
export function getDelFields(
  fields: FieldsData[] = [],
  oldFields: FieldsData[] = [],
): (string | number)[] {
  const res: (string | number)[] = [];
  oldFields.forEach((item) => {
    // 新的列表没找到代表删除了
    if (!fields.find((field) => field.value === item.value)) {
      res.push(item.value);
    }
  });
  return res;
}
