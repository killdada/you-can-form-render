/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */
// 辅助处理mock数据，mockjs不适用这个情况，本地调试表单设计器是需要保存提交本地数据，这里通过读写json模拟处理
import fs from 'fs-extra';
import { get, set } from 'lodash';
import path from 'path';

const resolvePath = (param: string) =>
  path.join(__dirname, 'json', `${param}.json`);

/**
 * @description 根据路径|key读取本地的json mock数据
 * @param jsonPath `string` json文件读取的路径
 * @param key `string` json返回的object可能需要读取到具体的那个key
 * @returns jsonPath文件导出对象[key] 的接口信息
 */
export const getMockDataByPath = (
  jsonPath: string,
  key?: any,
  defaultVal = {}
) => {
  const data = require(resolvePath(jsonPath)) || {};
  return {
    status: 0,
    data: key ? get(data, key, defaultVal) : data,
  };
};

/**
 * @description 根据路径保存本地的json mock数据
 * @param jsonPath `string` json文件读取的路径
 * @param key `string` json返回的object需要更新到哪个key
 * @returns jsonPath文件导出对象[key] 的接口信息
 */
export const saveMockDataByPath = async (
  jsonPath: string,
  data: any,
  key?: any
) => {
  // key不存在直接整个data替换，用data填充替换对应的key
  let result = require(resolvePath(jsonPath)) || {};
  if (key) {
    set(result, key, data);
  } else {
    result = data;
  }
  await fs.writeJsonSync(resolvePath(jsonPath), result, { spaces: 2 });
  return {
    status: 0,
    msg: '保存成功',
  };
};
