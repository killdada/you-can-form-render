import type { Request, Response } from 'express';
import { getMockDataByPath, saveMockDataByPath } from './util';

export default {
  // 支持自定义函数，API 参考 express@4, 流程撤回
  'POST /api/design/proc/recall': async (req: Request, res: Response) => {
    res.send({
      status: 0,
      data: '流程撤回成功',
    });
  },

  // 表单提交保存草稿
  'POST /api/design/proc/save': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath('detail', req.body.formMap, req.body.formId);
    res.send(data);
  },

  // 自定义表单提交数据
  'POST /api/v1/activiti/design/proc/submit': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath('detail', req.body.formMap, req.body.formId);
    res.send(data);
  },

  // 审批接口
  'POST /api/design/proc/approve': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath('detail', req.body.formMap, req.body.formId);
    res.send(data);
  },

  // 加签
  'POST /api/design/proc/joint': async (req: Request, res: Response) => {
    res.send({
      status: 0,
      data: '加签成功',
    });
  },

  // 转签
  'POST /api/design/proc/change': async (req: Request, res: Response) => {
    res.send({
      status: 0,
      data: '转签成功',
    });
  },

  //  获取审批历史列表
  '/api/v1/activiti/approveLog': (req: Request, res: Response) => {
    res.send(getMockDataByPath('approveLogs'));
  },

  // 获取历史用户任务节点列表（用于退回指定节点选择）
  '/api/design/proc/history/:taskId': (req: Request, res: Response) => {
    res.send(getMockDataByPath('taskList', req.params.taskId, []));
  },

  // 用户个人审批意见列表添加
  'POST /api/v1/activiti/design/opinion/save': async (req: Request, res: Response) => {
    const data = await saveMockDataByPath(
      'commentList',
      (req.body.opinions || []).map((item: string, index: number) => {
        return {
          id: index,
          createAt: Date.now(),
          createBy: 1,
          opinionInfo: item,
          status: 0,
          updateAt: Date.now(),
          userId: 1,
        };
      }),
    );
    res.send(data);
  },

  // 用户个人审批意见列表查询
  '/api/v1/activiti/design/opinion/list': (req: Request, res: Response) => {
    res.send(getMockDataByPath('commentList'));
  },
};
