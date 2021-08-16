import { pinyin } from '@/utils/base';

/**
 * 下拉框搜索
 * 首字母/文本匹配
 * @param {*} input 输入的值
 * @param {*} option 下拉框的下拉列表
 */
export function selectFilter(input: string, option: any) {
  return (
    pinyin(option.props.children).toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

/**
 * @template T 泛型 数组item泛型
 * @param {T[]} arr 传入的数组
 * @param {keyof T} key 根据该key判断，该key对应的value是否存在重复的值,如果key不传就当数组是单纯数组
 * @return {*} 重复返回 true,不重复返回false
 */
export function checkArrayIsRepeat<T>(arr: T[] = [], key?: keyof T) {
  if (typeof key === 'undefined') {
    return [...new Set(arr)].length !== arr.length;
  }
  const obj = {} as any;
  const flag = arr.every((item: T) => {
    if (obj[item[key]]) return false;
    obj[item[key]] = true;
    return true;
  });
  return !flag;
}
