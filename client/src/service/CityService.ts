// 省市区接口，内置，就是原来的linkpage接口的内置三种类型，
import type { ICity } from '@/types';
import { FormService } from './FormService';

// 不同环境的appId、appInterId可能不同,这里暂时写的测试环境的
const params = {
  appId: '5',
  appInterId: '34',
};

export const CityService = {
  /**
   * @description 获取省份列表
   * @returns Promise<any>
   */
  fetchProvinces: () =>
    FormService.fetchRemoteFormData<ICity[]>({
      ...params,
      countryId: 0,
    }),

  /**
   * @description 根据省份id获取城市列表
   * @returns Promise<any>
   */
  fetchCitysByProvinceId: (provinceId: string | number) =>
    FormService.fetchRemoteFormData<ICity[]>({
      ...params,
      provinceId,
    }),

  /**
   * @description 根据市区id获取区域列表
   * @returns Promise<any>
   */
  fetchAreasByCityId: (cityId: string | number) =>
    FormService.fetchRemoteFormData<ICity[]>({
      ...params,
      cityId,
    }),
};
