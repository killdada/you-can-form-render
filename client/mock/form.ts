import type { Request, Response } from 'express';
import { getMockDataByPath, saveMockDataByPath } from './util';

const getDesinData = async (req: Request) => {
  // schema数据 以前的formPage.fileText
  const { data: fileText } = await getMockDataByPath('schema', req.params.id);
  // design数据 以前的formInfo.formStr 字段列表描述等
  const { data: formInfo } = await getMockDataByPath('design', req.params.id);
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

export default {
  // 获取schema信息
  'GET /api/form/schema/:id?': (req: Request, res: Response) => {
    res.send(getMockDataByPath('schema', req.params.id));
  },

  // GET 可忽略 获取表单详情
  '/api/form/detail/:id?': (req: Request, res: Response) => {
    res.send(getMockDataByPath('detail', req.params.id));
  },

  // 支持自定义函数，API 参考 express@4, 保存schema信息
  'POST /api/form/schema/:id?': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath('schema', req.body, req.params.id);
    res.send(data);
  },

  // 保存表单详情
  'POST /api/form/detail/:id?': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath('detail', req.body, req.params.id);
    res.send(data);
  },

  // GET 可忽略 获取表单分类
  '/api/design/form/category/list': (req: Request, res: Response) => {
    res.send(getMockDataByPath('formCategory'));
  },

  // GET 可忽略 获取所有表单列表
  '/api/design/form/base/list': (req: Request, res: Response) => {
    res.send(getMockDataByPath('formList'));
  },

  // 设计时新增一个表单
  'POST /api/design/form/add': async (req: Request, res: Response) => {
    const { data: allSchema = {} } = await getMockDataByPath('schema');
    const allSchemaArr = Object.keys(allSchema) || [];
    // 取所有schema最后一项的key当做当前的id，然后再递增 ++
    const id = parseInt(allSchemaArr[allSchemaArr.length - 1] || '0', 10);
    const { fileText, ...other } = req.body;
    const { formStr, ...data } = other || {};
    // schema数据 以前的formPage.fileText
    await saveMockDataByPath('schema', JSON.parse(fileText), id + 1);
    // design数据 以前的formInfo.formStr 字段列表描述等
    await saveMockDataByPath('design', { ...data, formStr: JSON.parse(formStr) }, id + 1);
    res.send({
      status: 0,
      msg: '新增成功',
    });
  },

  // 获取设计时表单数据结构
  'POST /api/design/form/update': async (req: Request, res: Response) => {
    const { fileText, id, ...other } = req.body;
    const { formStr, ...data } = other || {};
    // schema数据 以前的formPage.fileText
    await saveMockDataByPath('schema', JSON.parse(fileText), id);
    // design数据 以前的formInfo.formStr 字段列表描述等
    await saveMockDataByPath('design', { ...data, formStr: JSON.parse(formStr) }, id);
    // 分开来保存
    res.send({
      status: 0,
      msg: '保存成功',
    });
  },

  // 获取运行时表单数据结构
  '/api/design/form/detail/:id?': async (req: Request, res: Response) => {
    const data = await getDesinData(req);
    // 组装表单详情产生的业务数据，以前的接口是一起返回的
    const { data: businessData } = getMockDataByPath('detail', req.params.id, {});
    const { data: processRecord } = getMockDataByPath('processRecord', req.params.id, {});
    res.send({
      status: 0,
      data: {
        ...data,
        businessData,
        processRecord,
      },
    });
  },

  // 获取设计时表单数据结构
  '/api/design/form/get/:id?': async (req: Request, res: Response) => {
    const data = await getDesinData(req);

    res.send({
      status: 0,
      data,
    });
  },

  // 申请审批表检验是否有提交权限
  'POST /api/v1/activiti/design/message/check': async (req: Request, res: Response) => {
    // 返回status 0 有权限
    res.send({
      status: 0,
      data: '',
    });
  },
};
