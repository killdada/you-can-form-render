import { getQuery } from '@/utils/base';
import type {
  SelectBindData,
  IDataBind,
  FormBindData,
  QueryConditionsVal,
  BindComponentType,
  RemoteBindData,
  IFormatRemoteData,
} from '@/types';
import { CustomWidgetsTypes } from '@/types';
import { EDataBindType, ERemoteBindType, QueryConditionsValMethod } from '@/types';

import { flattenSchema, getKeyFromUniqueId } from './tool';
import { getSystemData } from '../systemVar';
import { optimizeRemoteData } from './remoteData';

/**
 * @description 根据schema配置的查询条件组装返回需要的查询参数
 */
function getQueryCondition(conditions: QueryConditionsVal[] = []) {
  const res: Record<string, any> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const item of conditions) {
    const { value = '', method, name = '', type, required } = item;

    // 从url取数
    if (method === QueryConditionsValMethod.url) {
      const val = getQuery(value);
      // 必需参数但是没有取到值，直接抛出错误
      if (required && !val.length) {
        throw new Error(`查询条件${name}是必要条件（URL）！`);
      }
      res[name] = type === 'string' ? val : parseInt(val, 10);
    } else if (method === QueryConditionsValMethod.fixed) {
      // 固定值在提交的时候已经检验了不能为空，不需要判断required
      res[name] = type === 'string' ? value : parseInt(value, 10);
    } else if (method === QueryConditionsValMethod.system) {
      // 系统变量直接从 src/app.ts 入口文件获取的用户信息里面获取，暂不处理系统变量包含之前缓存的功能
      const val = getSystemData(value);
      // 必需参数但是没有取到值，直接抛出错误
      if (required && typeof val === undefined) {
        throw new Error(`查询条件${name}是必要条件（系统变量）！`);
      }
      res[name] = type === 'string' ? val : parseInt(val, 10);
    }
    // 本页面字段可能需要考虑更多东西，暂不处理
  }
  return res;
}

/**
 * @description 获取远程数据时需要的接口参数
 */
export function getApiQuery({
  data,
  id,
  type,
}: {
  data: Partial<RemoteBindData>;
  id: string;
  type: BindComponentType;
}): IFormatRemoteData {
  let query: Partial<RemoteBindData> = {};
  let result: IFormatRemoteData = { id, type };

  if (data.dataSourceMethod === ERemoteBindType.database) {
    // 数据库表名带过去
    query.databaseTableName = data.databaseTableName;
  } else {
    query.appId = data.appId;
    query.appInterId = data.appInterId;
  }
  query = { ...query, ...getQueryCondition(data.queryConditions) };

  if (type === 'select') {
    // 额外传递label value，请求完select接口以后根据这个设置对应的label，value
    result = {
      ...result,
      label: data.label,
      value: data.value,
    };
  }
  return { ...result, query };
}

/**
 *
 *
 * @description 根据接口返回的schema组装处理跟数据绑定相关的数据 dataBind （数据绑定）formDataBind 表单数据绑定 enumDataBind 下拉等数据绑定
 * @param {*} schema 接口获取的schema信息
 * @return {*}  {{
 *   remoteDatas: IFormatRemoteData[]; 远程绑定数据集合
 *   bindData: Record<string, any>; 本地数据绑定的系统变量
 * }}
 */
export function getDataBind(schema: any): {
  remoteDatas: IFormatRemoteData[];
  bindData: Record<string, any>;
} {
  const flattenData = flattenSchema(schema);
  // form里面没想到实列已经返回了扁平的数据
  // console.log('flattenData', flattenData);
  const remoteDatas = <any>[];
  const bindData: Record<string, any> = {};
  Object.entries(flattenData).forEach(([$id, item]) => {
    const {
      enumDataBind = {},
      formDataBind = {},
      dataBind = {},
      widget = '',
    }: {
      enumDataBind: Partial<SelectBindData>;
      formDataBind: Partial<FormBindData>;
      dataBind: Partial<IDataBind>;
      widget?: string;
    } = item.schema || {};

    const isTable = widget === CustomWidgetsTypes.mrTable;

    // 当前组件对应的id，现在只考虑一级的情况可以直接用这个设置值
    const id = getKeyFromUniqueId($id);

    if (enumDataBind.dataSourceMethod && enumDataBind.dataSourceMethod !== ERemoteBindType.fixed) {
      remoteDatas.push(getApiQuery({ data: enumDataBind, id, type: 'select' }));
    }

    if (formDataBind.dataSourceMethod) {
      // form全局配置接口返回的字段应该是页面管理该接口的所有的key，这里暂不处理全量返回赋值
      remoteDatas.push(getApiQuery({ data: formDataBind, id, type: 'form' }));
    }

    // 现在表格数据在组件里面自行处理，不在全局处理 （可以考虑在这里处理表格的数据，）
    if (dataBind.sourceMethod) {
      if (dataBind.sourceMethod === EDataBindType.remote) {
        // 远程的话，本地的已经绑定字段并且更新到bind里，第三方的也是更新到bind里，后续直接用表单详情接口赋值即可，测试不通过的话再额外处理，统一在formDataBind里面已经处理了这种情况，只需要请求下来全局表单接口即可·1··
      }
      // 处理系统变量, 表格系统变量被禁用，表格的field是数组
      if (dataBind.sourceMethod === EDataBindType.system && !isTable) {
        const val = getSystemData((dataBind.field || '') as string);
        bindData[id] = val;
      }

      // 其他字段单独绑定第三方远程接口
      if (dataBind.sourceMethod === EDataBindType.otherRemote) {
        remoteDatas.push({
          ...getApiQuery({ data: dataBind, id, type: 'data' }),
          field: isTable ? id : dataBind.field || '',
          isTable,
        });
      }
    }
  });

  const remote = optimizeRemoteData(remoteDatas);

  return {
    remoteDatas: remote,
    bindData,
  };
}
