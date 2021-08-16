/* eslint-disable */
// @ts-nocheck
import moment from 'dayjs';

/**
 * 将时间戳格式化为指定格式时间的字符串
 * @param {Number} timestamp Unix时间戳(**秒**)
 * @param {string} [format="minutes"] 'YYYY-MM-DD HH:mm'
 * @returns 格式后的时间字符串
 */
export function convertTimeToFormat(timestamp, format = 'minutes') {
  const time = moment.unix(timestamp);
  if (!time.isValid()) {
    return '';
  }
  const map = {
    compact: 'YYYYMMDD',
    days: 'YYYY-MM-DD',
    minutes: 'YYYY-MM-DD HH:mm',
    seconds: 'YYYY-MM-DD HH:mm:ss',
  };
  return time.format(map[format] || format);
}
