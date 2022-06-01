Object.defineProperty(exports, '__esModule', { value: true });
exports.saveMockDataByPath = exports.getMockDataByPath = void 0;
const tslib_1 = require('tslib');
/* eslint-disable no-irregular-whitespace */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// 辅助处理mock数据，mockjs不适用这个情况，本地调试表单设计器是需要保存提交本地数据，这里通过读写json模拟处理
const fs_extra_1 = tslib_1.__importDefault(require('fs'));
const get_1 = tslib_1.__importDefault(require('lodash/get'));
const set_1 = tslib_1.__importDefault(require('lodash/set'));
const path_1 = tslib_1.__importDefault(require('path'));

const resolvePath = function (param) {
  return path_1.default.join(__dirname, 'json', `${param}.json`);
};
/**
 * @description 根据路径|key读取本地的json mock数据
 * @param jsonPath `string` json文件读取的路径
 * @param key `string` json返回的object可能需要读取到具体的那个key
 * @returns jsonPath文件导出对象[key] 的接口信息
 */
const getMockDataByPath = function (jsonPath, key, defaultVal) {
  if (defaultVal === void 0) {
    defaultVal = {};
  }
  const data = require(resolvePath(jsonPath)) || {};
  return {
    status: 0,
    data: key ? get_1.default(data, key, defaultVal) : data,
  };
};
exports.getMockDataByPath = getMockDataByPath;
/**
 * @description 根据路径保存本地的json mock数据
 * @param jsonPath `string` json文件读取的路径
 * @param key `string` json返回的object需要更新到哪个key
 * @returns jsonPath文件导出对象[key] 的接口信息
 */
const saveMockDataByPath = function (jsonPath, data, key) {
  return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    let result;
    return tslib_1.__generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          result = require(resolvePath(jsonPath)) || {};
          if (key) {
            set_1.default(result, key, data);
          } else {
            result = data;
          }
          return [4 /* yield */, fs_extra_1.default.writeFileSync(resolvePath(jsonPath), result)];
        case 1:
          _a.sent();
          return [
            2 /* return */,
            {
              status: 0,
              msg: '保存成功',
            },
          ];
      }
    });
  });
};
exports.saveMockDataByPath = saveMockDataByPath;
// # sourceMappingURL=util.js.map
