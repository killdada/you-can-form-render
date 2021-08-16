import { useState, useCallback } from 'react';
import { isEmpty } from 'lodash-es';

import type {
  IDataBase,
  IDataBaseParams,
  IThirdDataBase,
  RemoteBindData,
  IThirdDataBaseApis,
  IFormCategory,
  IFormITEM,
} from '@/types';
import { ERemoteBindType } from '@/types';
import { FormService } from '@/service';

// 处理设计时需要绑定的远程数据来源
export default function useFormModel() {
  const [formCategorys, setFormCategorys] = useState<IFormCategory[]>([]);
  const [formList, setFormList] = useState<IFormITEM[]>([]);
  const [databaseList, setDatabaseList] = useState<IDataBase[]>([]);
  const [databaseParamList, setdatabaseParamList] = useState<IDataBaseParams[]>([]);
  const [thirdDatabaseList, setThirdDatabaseList] = useState<IThirdDataBase[]>([]);
  const [thirdDatabaseApiList, setThirdDatabaseApiList] = useState<IThirdDataBaseApis[]>([]);

  const initFormDesignData = useCallback(async (value?: RemoteBindData) => {
    // 本地数据表
    const { data: database = [] } = await FormService.fetchDataBase();
    // 第三方系统列表
    const { data: thirdData = [] } = await FormService.fetchThirdDataBase();
    // 表单分类
    const { data: categorys = [] } = await FormService.fetchCategoryList();
    // 所有表单列表
    const { data: fromList = [] } = await FormService.fetchFormList();
    setFormList(fromList);
    setFormCategorys(categorys);
    setDatabaseList(database);
    setThirdDatabaseList(thirdData);
    if (!isEmpty(value)) {
      const { dataSourceMethod, appId } = value || {};
      // 第三方的话需要额外再获取下 接口列表进行数据填充，默认刚开始没有请求这个联动的接口
      if (dataSourceMethod === ERemoteBindType.thirdDataBase && appId) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const { data = [] } = await FormService.fetchThirdDataBaseApis(appId);
        // 只需要更新列表值
        setThirdDatabaseApiList(data);
      }
    }
  }, []);

  // 第三方系统选择改变，根据第三方系统应用id重新获取该应用的接口列表
  const updateThirdDatabaseApiList = useCallback(async (id: string | number) => {
    const { data = [] } = await FormService.fetchThirdDataBaseApis(id);
    // 只需要更新列表值
    setThirdDatabaseApiList(data);
  }, []);

  // 本地数据库表选择改变，根据表名更新接口字段列表
  const updateDatabaseParamList = useCallback(async (tableName: string) => {
    try {
      const { data = [] } = await FormService.fetchDataBaseParams(tableName);
      // 只需要更新列表值
      const temp = isEmpty(data) ? [] : data;
      setdatabaseParamList(temp);
    } catch (e) {
      //
    }
  }, []);

  return {
    databaseList,
    databaseParamList,
    thirdDatabaseList,
    thirdDatabaseApiList,
    updateThirdDatabaseApiList,
    updateDatabaseParamList,
    initFormDesignData,
    formCategorys,
    formList,
  };
}
