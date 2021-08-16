import { Parser } from 'expr-eval';

/**
 * @description 检查传入的公式是否是合法的公式
 * @param {string} param 传入的表达式字符串
 * @return {*}  {boolean}
 */
export function checkFormula(param: string): boolean {
  const parser = new Parser();
  try {
    parser.parse(param);
  } catch (error) {
    return false;
  }
  return true;
}

/**
 * @param {string} param 表达式公式
 * @param {*} data 传入的表达是填充数据
 * @returns 最终的表达是计算结果
 */
export function getValueByFormula(param: string, data: any) {
  try {
    return Parser.evaluate(param, data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`计算过程出现错误${error.message || error}`);
    return false;
  }
}
