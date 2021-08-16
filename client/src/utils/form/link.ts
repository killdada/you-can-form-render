import { intersection, toNumber, toString, uniq, get, set, cloneDeep } from 'lodash-es';
import type {
  DataLinkItem,
  DataLinkAction,
  DataLinkCondition,
  IOptions,
  TOptionsType,
  IFlattenItem,
} from '@/types';
import type { FormInstance } from 'form-render';

import { getValueByFormula } from './formula';
import { checkSelectNeedOptions } from './fields';
import { flattenSchema, flattenFilterPrefix } from './tool';

/**
 * @param type 类型
 * @description 把参数包装成需要转换的类型
 */
function formatValByType(val: any, type: 'string' | 'number' | 'boolean') {
  if (type === 'string') return toString(val);
  if (type === 'number') return toNumber(val);
  return !!val;
}

function checkConditionsIsTrue(conditions: DataLinkCondition[], formData: any) {
  // 为空直接满足条件
  if (!conditions || !conditions.length) return true;
  let conditionStr = '';
  conditions.forEach((item, index) => {
    // type类型暂不考虑select等特殊情况，统一直接根据类型转
    const { field, value, sign, type, combine } = item;
    // 多选数组的包含情况
    let conditionVal = false;
    if (sign === 'includes') {
      const intersectionData = intersection(formData[field] || [], value || []);
      if (intersectionData.length === (value || []).length) {
        conditionVal = true;
      }
    } else {
      // eslint-disable-next-line no-eval
      conditionVal = eval(`${formData[field]} ${sign} ${formatValByType(value, type)}`);
    }
    if (index === 0) {
      conditionStr += `${conditionVal}`;
    } else {
      conditionStr += `${combine === 'and' ? '&&' : '||'} ${conditionVal}`;
    }
  });
  // eslint-disable-next-line no-eval
  return eval(conditionStr);
}

/**
 * @description 根据联动条件获得联动的组装的结果
 */
export function getLinkResult(formData: any, schema: any): Record<string, Partial<DataLinkAction>> {
  // console.log('formData', formData);
  // console.log('schema', schema);
  const { dataLink }: { dataLink: DataLinkItem[] } = schema;
  // 只需要处理已经启用的联动
  const enableDataLink = dataLink.filter((item) => item.isEnable);
  // 联动条件可能存在互斥，简单覆盖,最后一条条件符合覆盖掉前面的
  const result: Record<string, Partial<DataLinkAction>> = {};
  enableDataLink.forEach((item: DataLinkItem) => {
    const { conditions = [], actions = [] } = item;
    // 判断条件是否满足
    const conditionsIsTrue = checkConditionsIsTrue(conditions, formData);

    actions.forEach((action) => {
      const { isEnable, isRequired, isVisible, field, formula, options, isClear } = action;
      // 条件满足，计算该条件联动的字段处理
      if (conditionsIsTrue) {
        result[field] = {
          isEnable,
          isRequired,
          isVisible,
          options,
        };
        const newValue = formula?.value ? getValueByFormula(formula.value, formData) : false;
        // 计算后的结果没有出错，需要进行值覆盖
        if (newValue !== false) {
          result[field].value = newValue as unknown as string;
          result[field].conditionsFieldIds = conditions.map((condition) => condition.field);
        }
      } else if (isClear) {
        // 条件不满足并且不满足需要清空字段值
        result[field] = {
          ...(result[field] ? result[field] : {}),
          // 清空这个值类型有待确定，有可能有空数组，后续还是需要严格区分字段类型
          value: '',
          conditionsFieldIds: conditions.map((condition) => condition.field),
        };
      }
    });
  });
  return result;
}

/**
 * @param schema 配置信息
 * @returns 所有联动条件涉及到的字段数组
 */
export function getConditionsFields(schema: any) {
  const { dataLink = [] }: { dataLink: DataLinkItem[] } = schema;
  // 只需要处理已经启用的联动
  const enableDataLink = dataLink.filter((item) => item.isEnable);
  const result: (string | number)[] = [];
  enableDataLink.forEach((item) => {
    const { conditions = [] } = item;
    conditions.forEach((condition) => {
      result.push(condition.field);
    });
  });
  return uniq(result);
}

/**
 * @description 转入options结构，然后转化为schema需要的 enum enumNames结构
 * @param {IOptions[]} options
 * @return {defaultVal：  any[], enumLabel: (string | number)[], enumValue: (string | number)[]  }
 */
export function optionsToEnum(options: IOptions[], mode: TOptionsType) {
  const defaultVal: any[] = [];
  const enumLabel: (string | number)[] = [];
  const enumValue: (string | number)[] = [];
  options.forEach((item: IOptions) => {
    if (item.default) {
      defaultVal.push(item.value);
    }
    enumLabel.push(item.label);
    enumValue.push(item.value);
  });
  const singleVal = defaultVal.length ? defaultVal[0] : undefined;
  return {
    defaultVal: mode === 'multiple' ? defaultVal : singleVal,
    enumLabel,
    enumValue,
  };
}

/**
 * @param {*} data 处理之后的需要连动杆的结果
 * @param {*} form form表单实列
 */
export function updateDataLinktoSchema(
  data: Record<string, Partial<DataLinkAction>>,
  form: FormInstance,
) {
  // console.log('整理后没有问题需要的联动数据:', data);
  // 使用form.schema去计算options等，如果直接使用  form.flatten（实时数据） 会导致部分options配置丢失
  const flattenData: IFlattenItem = flattenFilterPrefix(flattenSchema(form.schema) || {});
  const newFlattenData = cloneDeep(flattenData || {});

  Object.keys(data).forEach((field) => {
    const { isEnable, isRequired, isVisible, value, options = [] } = data[field] as DataLinkAction;
    const currentFieldValue = form.formData[field];
    // 如果传递form.flatten去计算，form.flatten是实时的值，如果存在刚开始单选按钮 = 1，多选选项1，2,3,4 全部显示，单选按钮显示 2，多选选项只显示 1， 2， 3 的联动，当切换的时候，单选1切到2,2再切会1会导致 1的联动的多选选项丢失（设置newSchema导致了最初的完整的多选选项丢失了,应该使用最原始完整的schema去过滤计算）
    const {
      result,
      options: optionsData = [],
      mode,
    } = checkSelectNeedOptions(field, [], flattenData);
    const newSchema: any = {
      disabled: !isEnable,
      required: isRequired,
      hidden: !isVisible,
    };
    if (result) {
      const { defaultVal, enumLabel, enumValue } = optionsToEnum(
        optionsData.filter((item) => options.includes(item.value)),
        mode as TOptionsType,
      );
      newSchema.enumNames = enumLabel;
      newSchema.enum = enumValue;
      // select选项没有值给个默认值
      if (typeof currentFieldValue === 'undefined') {
        newSchema.default = defaultVal;
      }
    }

    // console.log('更新后的数据', field, newSchema, value, form.schema);
    const currentFiledSchema = get(newFlattenData, field, {});
    set(newFlattenData, field, { ...currentFiledSchema, ...newSchema });
    // 直接设置setSchemaByPath，如果该条件下存在多个组件需要更新，那么可能导致schema直接覆盖，改用 setSchema全局改
    // form.setSchemaByPath(field, newSchema);

    // select目前支持联动配置options,但是不支持设置值
    if (!result) {
      form.setValueByPath(field, value);
    }
  });
  form.setSchema(newFlattenData);
}

export function getWatch(schema: any, form: FormInstance) {
  const conditionFieldIds = getConditionsFields(schema);
  const result: Record<
    string | number,
    (value?: any) => void | { handler: (value?: any) => void; immediate: boolean }
  > = {};

  conditionFieldIds.forEach((field: string | number) => {
    result[field] = () => {
      const data = getLinkResult(form.formData, schema);
      updateDataLinktoSchema(data, form);
    };
  });
  return result;
}
