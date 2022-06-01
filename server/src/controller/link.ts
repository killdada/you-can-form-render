import { Controller, Query, Provide, ALL, Get } from '@midwayjs/decorator';
import { getMockDataByPath } from './util';

@Provide()
@Controller('/api')
export class LinkController {
  // 获取本地数据库来源表
  @Get('/design/form/table/list')
  async table(): Promise<any> {
    const data = getMockDataByPath('database');
    return data;
  }

  // 根据选择的本地数据库表名获取字段列表
  @Get('/design/form/param/list')
  async param(
    @Query(ALL)
    query: any
  ): Promise<any> {
    const data = getMockDataByPath(
      'databaseDetailByName',
      query.tableName || ''
    );
    return data;
  }

  // 获取第三方系统来源表
  @Get('/design/app/list')
  async applist(): Promise<any> {
    const data = getMockDataByPath('thirdDataBase');
    return data;
  }

  // 之前的linkpage接口，远程数据接口
  @Get('/v1/activiti/design/app/interface/list')
  async appinterface(
    @Query(ALL)
    query: any
  ): Promise<any> {
    const data = getMockDataByPath('thirdDataBaseById', query.appId || '', []);
    return data;
  }

  // 根据 appId 应用id获取第三方数据库接口列表
  @Get('/design/form/linkage')
  async linkage(
    @Query(ALL)
    query: any
  ): Promise<any> {
    // 省市区模拟
    let data = getMockDataByPath('linkpage', query.appInterId, {});
    if (typeof query.cityId !== 'undefined') {
      data = getMockDataByPath('city', `areaList.${query.cityId}`, []);
    } else if (typeof query.provinceId !== 'undefined') {
      data = getMockDataByPath('city', `cityList.${query.provinceId}`, []);
    } else if (typeof query.countryId !== 'undefined') {
      data = getMockDataByPath('city', 'provinceList', []);
    }
    return data;
  }
}

