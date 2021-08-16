/* eslint-disable */
// @ts-nocheck
/**
 * 过滤XSS
 * @param str 需要过滤的内容
 * @returns {string} 显示的内容
 */
function xss(str) {
  const div = document.createElement('div');
  const text = document.createTextNode(str);
  let val = '';

  div.appendChild(text);
  val = div.innerHTML;
  return val;
}

/**
 * 获取url或者自定义字符串中的参数
 * @param name 不传name则直接返回整个参数对象
 * @param queryStr 自定义字符串
 * @param unxss 不进行参数XSS安全过滤
 * @param undecode 不进行自动解码
 * @returns {*} 获取到的参数值或者由所有参数组成完整对象
 */
function getQuery(name = null, queryStr = null, unxss = false, undecode = false) {
  const searchArr = queryStr || window.location.href;
  const str = searchArr.split('?')[1];
  if (!str) return name ? undefined : {};

  let tempArr;
  let temp;
  const obj = {};
  const arr = str.split('&');
  const len = arr.length;

  for (let i = 0; i < len; i++) {
    try {
      tempArr = arr[i].split('=');
      if (tempArr.length === 2) {
        temp = undecode ? tempArr[1] : decodeURIComponent(tempArr[1]);
        obj[tempArr[0]] = unxss ? temp : xss(temp);
      }
    } catch (e) {
      //
    }
  }

  return name ? obj[name] : obj;
}

export { xss, getQuery };
