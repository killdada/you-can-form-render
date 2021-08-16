/**
 * @description 将节点耗时转换成'x天y时z分'的格式
 * @param {number} data 要转换的时间，单位是分
 * @param {number} status 流程状态， 流程状态为6（待处理）不展示耗时
 * @returns {string} 返回 'x天y时z分'
 */
export function getTimeConsume(data: number, status: any) {
  if (status === 6) return '';
  if (!data || typeof data !== 'number') return '0 分';
  if (data < 60) {
    return `${data} 分`;
  }
  if (data < 1440) {
    return `${Math.floor(data / 60)} 时 ${data % 60} 分`;
  }
  const date = Math.floor(data / 1440);
  const temp = data % 1440;
  const hour = Math.floor(temp / 60);
  const minite = temp % 60;
  return `${date} 天 ${hour} 时 ${minite} 分`;
}
