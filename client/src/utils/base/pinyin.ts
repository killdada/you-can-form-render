/* eslint-disable */
// @ts-nocheck

import 'pinyin4js';

/**
 * 获取每个汉字的首个拼音，实现拼音模糊搜索功能
 * @param {String} value 需要转拼音的汉字
 * @returns {String} 返回每个汉字的首个拼音
 */
export function pinyin(value) {
  return window.PinyinHelper.getShortPinyin(value);
}
