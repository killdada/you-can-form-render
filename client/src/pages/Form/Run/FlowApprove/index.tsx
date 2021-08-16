import type { FC } from 'react';
import { memo, useState, useRef, useEffect } from 'react';

import { useSetState } from 'ahooks';

import type { FormInstance } from 'antd';
import { Card, Button } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';

import { StaffTree } from '@/components';
import { FlowService } from '@/service';
import type { ITASKLIST } from '@/types';

import type { IFlowApproveProps, IFlowApproveState } from '@/types';
import { ApproveStatus } from '@/types';
import FlowApproveComment from './Comment';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// 流程审批
const FlowApprove: FC<IFlowApproveProps> = (props) => {
  const formRef = useRef<FormInstance>();

  // 审批需要的表单数据
  const [state] = useSetState<IFlowApproveState>({
    status: 1,
    destActivityId: undefined,
    staffValue: '',
    afterFlag: 0,
    comment: '',
  });

  // 历史用户任务节点列表,审批拒接时选取,退回节点
  const [destActivityList, setDestActivityList] = useState<ITASKLIST[]>([]);

  const onChangeSelectComment = (value: string) => {
    formRef.current?.setFieldsValue({ comment: value });
  };

  const fetchTasks = async (taskId: string | number) => {
    try {
      const { data } = await FlowService.fetchHistoryTasks(taskId);
      setDestActivityList(data);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    if (typeof props.taskId !== 'undefined') {
      fetchTasks(props.taskId);
    }
  }, [props.taskId]);

  const onFinish = async (values: IFlowApproveState) => {
    // console.log('审批表单检验完成提交数据，onFinish', values);
    props.approve(values);
  };

  return (
    <Card title="审批表" style={{ marginBottom: 20 }} bodyStyle={{ paddingBottom: 0 }}>
      <ProForm
        initialValues={state}
        layout="horizontal"
        formRef={formRef}
        onFinish={onFinish}
        {...formItemLayout}
        submitter={{
          // 完全自定义整个区域
          render: (form) => {
            const btns = [
              <Button type="primary" key="approve" onClick={() => form.submit()}>
                提交审批
              </Button>,
              <Button type="default" key="back" onClick={props.cancel}>
                返回
              </Button>,
            ];
            if (props.canRecall) {
              btns.push(
                <Button type="primary" onClick={props.recall} key="recall">
                  撤回
                </Button>,
              );
            }
            return btns;
          },
        }}
      >
        <ProForm.Item label="申请人">
          <p>{props.assigneesName || ''}</p>
        </ProForm.Item>
        <ProFormRadio.Group
          name="status"
          label="审批状态"
          options={[
            {
              label: '通过',
              value: 1,
            },
            {
              label: '退回',
              value: 0,
            },
            {
              label: '转办',
              value: 3,
            },
            {
              label: '加签',
              value: 2,
            },
          ]}
        />

        <ProForm.Item label="常用意见">
          <FlowApproveComment onChange={onChangeSelectComment}></FlowApproveComment>
        </ProForm.Item>

        <ProFormDependency name={['status']}>
          {({ status }) => {
            if (status === ApproveStatus.return) {
              return (
                <ProFormSelect
                  name="destActivityId"
                  label="退回节点"
                  options={destActivityList.map((item) => {
                    return {
                      label: item.activityName,
                      value: item.activityId,
                    };
                  })}
                  placeholder="请选择退回节点"
                  rules={[{ required: true, message: '请选择退回节点!' }]}
                />
              );
            }
            if (status === ApproveStatus.change) {
              return (
                <ProForm.Item
                  label="处理人员"
                  name="staffValue"
                  rules={[{ required: true, message: '请选择处理人员！' }]}
                >
                  <StaffTree></StaffTree>
                </ProForm.Item>
              );
            }
            if (status === ApproveStatus.join) {
              return (
                <>
                  <ProFormSelect
                    name="afterFlag"
                    label="选择加签方式"
                    tooltip="前加签即加签人在自己审核之前审核，后加签则提交后当前节点自动完成审核，加签人审核完成后该节点通过"
                    options={[
                      {
                        label: '前加签',
                        value: 0,
                      },
                      {
                        label: '后加签',
                        value: 1,
                      },
                    ]}
                    placeholder="请选择选择加签方式"
                    allowClear={false}
                    rules={[{ required: true, message: '请选择选择加签方式!' }]}
                  />
                  <ProForm.Item
                    label="处理人员"
                    name="staffValue"
                    rules={[{ required: true, message: '请选择处理人员！' }]}
                  >
                    <StaffTree></StaffTree>
                  </ProForm.Item>
                </>
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormTextArea
          name="comment"
          label="审批意见"
          placeholder="请输入审批意见"
          rules={[{ required: true, message: '请输入审批意见!' }]}
          fieldProps={{
            autoSize: { minRows: 3, maxRows: 10 },
            maxLength: 1000,
          }}
        />
      </ProForm>
    </Card>
  );
};

export default memo(FlowApprove);
