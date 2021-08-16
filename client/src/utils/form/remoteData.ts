import type { IFormatRemoteData } from '@/types';

// [
//   { id: 'input_8grVsh', type: 'data', query: { appId: 23, appInterId: 190 } },
//   { id: 'input_8grVsh_jmXqty', type: 'data', query: { appId: 23, appInterId: 190 } },
//   {
//     id: 'select_hd1W3s',
//     type: 'select',
//     label: 'categoryName',
//     value: 'categoryId',
//     query: { appId: 2, appInterId: 122 },
//   },
//   {
//     id: 'select_hd1W3s_DwvLw-',
//     type: 'select',
//     label: 'categoryName',
//     value: 'categoryId',
//     query: { appId: 2, appInterId: 122 },
//   },
//   {
//     id: 'select_hd1W3s_DwvLw-_lKzMWI',
//     type: 'select',
//     label: 'categoryName1',
//     value: 'categoryId',
//     query: { appId: 2, appInterId: 122 },
//   },
//   { id: '#', type: 'form', query: { appId: 2, appInterId: 30 } },
//   { id: 'table_VAqQK5', type: 'data', query: { appId: 23, appInterId: 190 } },
// ];

// 转化后的请求数据结构
// [
//   { id: '#', type: 'form', query: { appId: 2, appInterId: 30 } },
//   {
//     id: 'input_8grVsh',
//     type: 'data',
//     query: { appId: 23, appInterId: 190 },
//     field: ['customer1', 'customer'],
//     isTable: false,
//   },
//   {
//     id: 'select_hd1W3s',
//     type: 'select',
//     label: 'categoryName',
//     value: 'categoryId',
//     query: { appId: 2, appInterId: 122 },
//     selectData: [
//       { id: 'select_hd1W3s', label: 'categoryName', value: 'categoryId' },
//       { id: 'select_hd1W3s_DwvLw-', label: 'categoryName', value: 'categoryId' },
//       { id: 'select_hd1W3s_DwvLw-_lKzMWI', label: 'categoryName1', value: 'categoryId' },
//     ],
//   },
//   {
//     id: 'table_VAqQK5',
//     type: 'data',
//     query: { appId: 23, appInterId: 191 },
//     field: ['table_VAqQK5'],
//     isTable: true,
//   },
// ];

// 当页面绑定数据接口如上结构，其中数组1数组2绑定的是同一个接口，数组3数组4也是同一个接口，数组5和3,4是同一个接口但是绑定的labbel不同，这里做一层优化处理，过滤掉相同的接口地址 （接口地址一样，参数一样，现在的情况主要就是query一样）

export function optimizeRemoteData(data: IFormatRemoteData[] = []): IFormatRemoteData[] {
  const result: IFormatRemoteData[] = [];
  const idsMap = {} as any;
  data.forEach((item) => {
    const { type, query, isTable = false, ...other } = item || {};
    // 全局表单只有一个绑定不存在重复
    if (type === 'form') {
      result.push(item);
    } else if (type === 'select' || type === 'data') {
      // 用type ，query当唯一key，现在只有比较这二个就知道是不是重复的接口，isTable 也需要加进来区分
      const key = `${isTable}${type}${JSON.stringify(query)}`;
      // 存在，值拼接
      if (idsMap[key]) {
        if (type === 'select') {
          idsMap[key].selectData.push(other);
        } else {
          idsMap[key].field.push(item.field);
        }
      } else if (type === 'select') {
        // 不存在先初始化
        idsMap[key] = {
          ...item,
          selectData: [other],
        };
      } else {
        idsMap[key] = {
          ...item,
          field: [item.field],
        };
      }
    }
  });
  Object.keys(idsMap).forEach((key: string) => {
    result.push(idsMap[key]);
  });
  return result;
}
