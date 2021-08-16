export const varReg = /^[a-zA-Z_$][a-zA-Z0-9_]*/;

// 常用正则 \前面需加一个\  例如匹配数字\d => \\d
export const commonReg = {
  email: {
    pattern: '^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$',
    name: '邮箱',
    message: '不满足邮箱规则',
  },
  phone: {
    pattern: '^1(3|4|5|6|7|8|9)\\d{9}$',
    name: '手机号',
    message: '不满足手机规则',
  },
  domain: {
    pattern:
      '^((http://)|(https://))?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?.)+[a-zA-Z]{2,6}(/)',
    name: '域名',
    message: '不满足域名规则',
  },
  zh: {
    pattern: '^[\\u4e00-\\u9fa5]{0,}$',
    name: '中文',
    message: '不满足中文规则',
  },
  zh_number: {
    pattern: '^[A-Za-z0-9]+$',
    name: '英文或数字',
    message: '不满足英文或数字规则',
  },
  en: {
    pattern: '^[A-Za-z]+$',
    name: '英文',
    message: '不满足英文规则',
  },
  zh_en: {
    pattern: '^[\\u4e00-\\u9fa5a-zA-Z]+$',
    name: '中英文',
    message: '不满足中英文规则',
  },
  number: {
    pattern: '^[1-9]\\d*$',
    name: '数字',
    message: '不满足数字规则',
  },
  decimal: {
    pattern: '^(-?\\d+)(.\\d+)?$',
    name: '浮点数',
    message: '不满足浮点数规则',
  },
};
