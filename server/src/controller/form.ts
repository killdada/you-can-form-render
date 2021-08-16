import {
  Controller,
  Provide,
  ALL,
  Post,
  Get,
  Param,
  Body,
} from '@midwayjs/decorator';
import { getMockDataByPath, saveMockDataByPath } from './util';

const getDesinData = async (params: any) => {
  // schema数据 以前的formPage.fileText
  const { data: fileText } = await getMockDataByPath('schema', params.id);
  // design数据 以前的formInfo.formStr 字段列表描述等
  const { data: formInfo } = await getMockDataByPath('design', params.id);
  const data = {
    formPage: {
      fileText: JSON.stringify(fileText),
    },
    formInfo: {
      ...formInfo,
      formStr: JSON.stringify(formInfo.formStr),
    },
  };
  return data;
};

@Provide()
@Controller('/api')
export class FormController {
  // 获取schema信息
  @Get('/form/schema/:id?')
  async schema(@Param(ALL) params: any): Promise<any> {
    const data = getMockDataByPath('schema', params.id);
    return data;
  }

  // 获取表单详情
  @Get('/form/detail/:id?')
  async form(@Param(ALL) params: any): Promise<any> {
    const data = getMockDataByPath('detail', params.id);
    return data;
  }

  // 保存schema信息
  @Post('/form/schema/:id?')
  async saveschema(
    @Body(ALL) body: any,
    @Param(ALL) params: any
  ): Promise<any> {
    const data = await saveMockDataByPath('schema', body, params.id);
    return data;
  }

  // 保存表单详情
  @Post('/form/detail/:id?')
  async saveform(@Body(ALL) body: any, @Param(ALL) params: any): Promise<any> {
    const data = await saveMockDataByPath('detail', body, params.id);
    return data;
  }

  // 获取表单分类
  @Get('/design/form/category/list')
  async category(): Promise<any> {
    const data = getMockDataByPath('formCategory');
    return data;
  }

  // 获取所有表单列表
  @Get('/design/form/base/list')
  async formList(): Promise<any> {
    const data = getMockDataByPath('formList');
    return data;
  }

  // 设计时新增一个表单
  @Post('/design/form/add')
  async add(@Body(ALL) body: any): Promise<any> {
    const { data: allSchema = {} } = await getMockDataByPath('schema');
    const allSchemaArr = Object.keys(allSchema) || [];
    // 取所有schema最后一项的key当做当前的id，然后再递增 ++
    const id = parseInt(allSchemaArr[allSchemaArr.length - 1] || '0', 10);
    const { fileText, ...other } = body;
    const { formStr, ...data } = other || {};
    // schema数据 以前的formPage.fileText
    await saveMockDataByPath('schema', JSON.parse(fileText), id + 1);
    // design数据 以前的formInfo.formStr 字段列表描述等
    await saveMockDataByPath(
      'design',
      { ...data, formStr: JSON.parse(formStr) },
      id + 1
    );
    return {
      status: 0,
      msg: '新增成功',
    };
  }

  // 更新
  @Post('/design/form/update')
  async update(@Body(ALL) body: any): Promise<any> {
    const { fileText, id, ...other } = body;
    const { formStr, ...data } = other || {};
    // schema数据 以前的formPage.fileText
    await saveMockDataByPath('schema', JSON.parse(fileText), id);
    // design数据 以前的formInfo.formStr 字段列表描述等
    await saveMockDataByPath(
      'design',
      { ...data, formStr: JSON.parse(formStr) },
      id
    );
    // 分开来保存
    return {
      status: 0,
      msg: '保存成功',
    };
  }

  // 获取运行时表单数据结构
  @Get('/design/form/detail/:id?')
  async runForm(@Param(ALL) params: any): Promise<any> {
    const data = await getDesinData(params);
    // 组装表单详情产生的业务数据，以前的接口是一起返回的
    const { data: businessData } = getMockDataByPath('detail', params.id, {});
    const { data: processRecord } = getMockDataByPath(
      'processRecord',
      params.id,
      {}
    );
    return {
      status: 0,
      data: {
        ...data,
        businessData,
        processRecord,
      },
    };
  }

  // 获取设计时表单数据结构
  @Get('/design/form/get/:id?')
  async designForm(@Param(ALL) params: any): Promise<any> {
    const data = await getDesinData(params);
    return {
      status: 0,
      data,
    };
  }

  // 申请审批表检验是否有提交权限
  @Post('/v1/activiti/design/message/check')
  async check(): Promise<any> {
    // 返回status 0 有权限
    return {
      status: 0,
      data: '',
    };
  }
}
