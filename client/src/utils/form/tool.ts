import { cloneDeep } from 'lodash-es';
import type { IFlattenItem } from '@/types';

// 方法全部来源schema-generator 的 utils

/**
 * @description 从扁平之后的schema数据获取当前的组件的id
 * @param uniqueId 可选
 * @returns {string}
 */
export const getKeyFromUniqueId = (uniqueId = '#') => {
  const arr = uniqueId.split('/');
  return arr[arr.length - 1];
};

/**
 * @param {*} flatten : IFlattenItem flattenSchema 方法获得的参数
 * @returns IFlattenItem 剔除掉 flattenSchema 方法获得的 #/
 */
export function flattenFilterPrefix(flatten: IFlattenItem = {}) {
  const res: IFlattenItem = {};
  Object.keys(flatten).forEach((key) => {
    res[(key || '').replace(/^#\//, '')] = flatten[key];
  });
  return res;
}

/**
 * @author 来源于同源的schema-generator 的utils里面的方法
 * @description 将schema的树形结构扁平化成一层, 后面三个参数都是内部递归使用的
 * @param {*} schema
 * @param {string} [name='#'] 内部递归
 * @param {*} parent 内部递归
 * @param {*} [result={}] 内部递归
 * @return {*} {IFlattenItem[]}
 */
export function flattenSchema(
  schema: any,
  name: string = '#',
  parent?: any,
  result: any = {} as any,
): IFlattenItem {
  // eslint-disable-next-line no-underscore-dangle
  const _schema = cloneDeep(schema);
  if (!_schema.$id) {
    _schema.$id = name; // 给生成的schema添加一个唯一标识，方便从schema中直接读取
  }
  const children: string[] = [];
  const isObj = _schema.type === 'object' && _schema.properties;
  const isList = _schema.type === 'array' && _schema.items && _schema.items.properties;
  if (isObj) {
    Object.entries(_schema.properties).forEach(([key, value]) => {
      const uniqueName = `${name}/${key}`;
      children.push(uniqueName);
      flattenSchema(value, uniqueName, name, result);
    });
    delete _schema.properties;
  }
  if (isList) {
    Object.entries(_schema.items.properties).forEach(([key, value]) => {
      const uniqueName = `${name}/${key}`;
      children.push(uniqueName);
      flattenSchema(value, uniqueName, name, result);
    });
    delete _schema.items.properties;
  }
  if (_schema.type) {
    // eslint-disable-next-line no-param-reassign
    result[name] = { parent, schema: _schema, children };
  }
  return result;
}

/** 包装返回的结果是数组[] */
export const getArray = (arr: any, defaultValue = []) => {
  if (Array.isArray(arr)) return arr;
  return defaultValue;
};

// final = true 用于最终的导出的输出
// 几种特例：
// 1. 删除时值删除了item，没有删除和parent的关联，也没有删除children，所以要在解析这步来兜住 (所有的解析都是)
// 2. 修改$id的情况, 修改的是schema内的$id, 解析的时候要把schema.$id 作为真正的id (final = true的解析)
export function idToSchema(flatten: IFlattenItem, id = '#', final = false) {
  let schema: any = {};
  const item = cloneDeep(flatten[id]);
  if (item) {
    schema = { ...item.schema };
    // 最终输出去掉 $id
    if (final && schema.$id) {
      delete schema.$id;
    }
    if (schema.type === 'array') {
      if (!schema.items) schema.items = {};
      if (!schema.items.type) {
        schema.items.type = 'object';
      }
    }
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        let childId = child;
        // TODO: 这个情况会出现吗？return会有问题吗？
        if (!flatten[child]) {
          return;
        }
        // 最终输出将所有的 key 值改了
        try {
          if (final) {
            childId = flatten[child].schema.$id;
          }
        } catch (error) {
          // console.log('catch', error);
        }
        const key = getKeyFromUniqueId(childId);
        if (schema.type === 'object') {
          if (!schema.properties) {
            schema.properties = {};
          }
          schema.properties[key] = idToSchema(flatten, child, final);
        }
        if (schema.type === 'array' && schema.items && schema.items.type === 'object') {
          if (!schema.items.properties) {
            schema.items.properties = {};
          }
          schema.items.properties[key] = idToSchema(flatten, child, final);
        }
      });
    } else {
      if (schema.type === 'object' && !schema.properties) {
        schema.properties = {};
      }
      if (
        schema.type === 'array' &&
        schema.items &&
        schema.items.type === 'object' &&
        !schema.items.properties
      ) {
        schema.items.properties = {};
      }
    }
  }
  return schema;
}
