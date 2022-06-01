import {
  Controller,
  Post,
  Provide,
  ALL,
  Body,
  Get,
  Param,
} from '@midwayjs/decorator';
import { getMockDataByPath, saveMockDataByPath } from './util';

@Provide()
@Controller('/api')
export class FlowController {
  // 流程撤回成功
  @Post('/design/proc/recall')
  async recall(): Promise<any> {
    return {
      status: 0,
      data: '流程撤回成功',
    };
  }

  // 表单提交保存草稿
  @Post('/design/proc/save')
  async getListEmployeeRelation(
    @Body(ALL)
    body: any
  ): Promise<any> {
    const data = await saveMockDataByPath('detail', body.formMap, body.formId);
    return data;
  }

  // 自定义表单提交数据
  @Post('/v1/activiti/design/proc/submit')
  async submit(
    @Body(ALL)
    body: any
  ): Promise<any> {
    const data = await saveMockDataByPath('detail', body.formMap, body.formId);
    return data;
  }

  // 审批接口
  @Post('/design/proc/approve')
  async approve(
    @Body(ALL)
    body: any
  ): Promise<any> {
    const data = await saveMockDataByPath('detail', body.formMap, body.formId);
    return data;
  }

  // 加签
  @Post('/design/proc/joint')
  async joint(): Promise<any> {
    return {
      status: 0,
      data: '加签成功',
    };
  }

  // 转签
  @Post('/design/proc/change')
  async change(): Promise<any> {
    return {
      status: 0,
      data: '转签成功',
    };
  }

  //  获取审批历史列表
  @Get('/v1/activiti/approveLog')
  async approveLog(): Promise<any> {
    const data = getMockDataByPath('approveLogs');
    return data;
  }

  // 获取历史用户任务节点列表（用于退回指定节点选择）
  @Get('/design/proc/history/:taskId')
  async history(
    @Param(ALL)
    params: any
  ): Promise<any> {
    const data = getMockDataByPath('taskList', params.taskId, []);
    return data;
  }

  // 用户个人审批意见列表添加
  @Post('/v1/activiti/design/opinion/save')
  async opinion(
    @Body(ALL)
    body: any
  ): Promise<any> {
    const data = await saveMockDataByPath(
      'commentList',
      (body.opinions || []).map((item: string, index: number) => {
        return {
          id: index,
          createAt: Date.now(),
          createBy: 1,
          opinionInfo: item,
          status: 0,
          updateAt: Date.now(),
          userId: 1,
        };
      })
    );
    return data;
  }

  // 用户个人审批意见列表查询
  @Get('/activiti/design/opinion/list')
  async opinionList(): Promise<any> {
    const data = getMockDataByPath('commentList');
    return data;
  }
}

