import { convertTimeToFormat } from '@/utils/base';
import { getUser } from '@/utils';

// 处理系统变量，查询条件绑定或者是值的绑定都可以直接绑定这些变量，系统变量除了之前的 session里面的内容，新增整合了qiankun 缓存值，缓存值相当于都是预设好的，因此都是（缓存值后续等接入qiankun再处理）
export const systemVarList = [
  { label: '当前填表人的姓名', value: 'name' },
  { label: '当前填表人的部门', value: 'deptName' },
  { label: '当前填表的时间', value: 'nowTime' },
  { label: '工号', value: 'code' },
  { label: '部门ID', value: 'deptId' },
  { label: '员工ID', value: 'userId' },
  { label: '上级ID', value: 'supervisorId' },
  { label: '公司ID', value: 'compId' },
  { label: '公司名称', value: 'compName' },
];

/**
 *
 * @param key {string} 要获取的系统变量key,后续处理之前的缓存变量
 * @returns 对应的系统变量值 any
 */
export const getSystemData = (key: string) => {
  // key nowTime直接获取当前时间
  return key === 'nowTime' ? convertTimeToFormat(Date.now() / 1000) : getUser(key);
};
