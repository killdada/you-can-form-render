import type { FC } from 'react';
import React, { useEffect, useCallback } from 'react';

import { pick } from 'lodash-es';
import { useBoolean, useSetState } from 'ahooks';
import { useModel } from 'umi';

import { Button, Spin, message, Modal } from 'antd';
import type { Error, ValidateParams } from 'form-render';
import FormRender, { useForm } from 'form-render';

import { FormTypes } from '@/types';
import { isPhone } from '@/constants';

import { getDataBind, getWatch } from '@/utils';
import { getQuery, redirect } from '@/utils/base';
import { FlowService, FormService } from '@/service';

import { runWidgets } from '../Widgets';
import { useSchema } from '../hooks';
import ModifyHistory from './ModifyHistory';
import FlowTable from './FlowTable';
import FlowApprove from './FlowApprove';

import type {
  IQuery,
  OperationTypes,
  IFlowApproveState,
  IApproveLogItem,
  WrapperSchemaProps,
} from '@/types';
import { ApproveStatus, JoinStatus } from '@/types';
import { submitFuncMap, basicSubmitCheck, toRedirectUrl } from './util';

import styles from './index.less';

const widgets = {
  ...runWidgets,
};

// 点击按钮的类型, 那些需要通过表单自带检验的form.submit()方法带检验，但是无法传递变量，这里用临时变量处理
let submitType: OperationTypes;
// 跟上面的变量一个
let approveValues: IFlowApproveState = {} as IFlowApproveState;

interface IBaseState {
  /** @description 是否有按钮正在提交中 */
  isSubmitting: boolean;
  // 审批历史数据
  approveTableData: IApproveLogItem[];
  // 申请人
  assigneesName: string;
}

const Run: FC<WrapperSchemaProps> = ({ id }) => {
  const form = useForm();

  const queryData: IQuery = getQuery() || {};
  const { initialState = {} as any } = useModel('@@initialState');

  const { schema, formBusinessData } = useModel('schemaModel', (model) => ({
    schema: model.schema,
    formBusinessData: model.formBusinessData,
  }));

  const { errorFieldsRef } = useModel('fieldsModel', (model) => ({
    errorFieldsRef: model.errorFieldsRef,
  }));

  // url query参数集合
  const [query, setQuery] = useSetState<IQuery>({
    businessId: queryData.businessId || 0,
    taskId: queryData.taskId || 0,
    piId: queryData.piId || 0,
    // 默认是非钉钉来源
    fromManage: parseInt((queryData?.fromManage as unknown as string) || '0', 10),
    // 默认是功能表，查看详情
    messageType: parseInt((queryData?.messageType as unknown as string) || '', 10),
    flag: queryData.flag,
    // 流程是否可撤回 undefined '1' '2' 都是可撤回
    canRecall:
      typeof queryData.procStatus === 'undefined' || ['1', '2'].includes(queryData.procStatus),
  });

  // 一些基础state
  const [state, setState] = useSetState<IBaseState>({
    isSubmitting: false,
    approveTableData: [],
    assigneesName: '',
  });

  const [formDataLoading, { setTrue, setFalse }] = useBoolean(true);

  const fetchRemoteData = useCallback(async () => {
    setTrue();
    const { remoteDatas, bindData } = getDataBind(schema);
    // 远程接口数据
    const promises = remoteDatas.map((item) => FormService.fetchRemoteFormData(item.query));
    const remoteDataResult = await Promise.all(promises);
    // 本身表单详情业务数据,以前业务已经数据整合到design同一个接口了
    // const { data: detail } = await FormService.fetchFormDetail(id);
    const detail = formBusinessData.businessData || {};
    // 本地系统变量的默认值等
    let values = { ...bindData };
    remoteDataResult.forEach((item, index: number) => {
      const data = item.data as any;
      const remoteData = remoteDatas[index] || {};
      const { type, selectData = [], field = [], isTable = false } = remoteData;
      if (type === 'form') {
        // 表单配置全局绑定接口，然后组件绑定这个接口对应的字段，需要把改接口数据最后拼接到值里面去 (后面考虑过滤下多余字段)
        values = { ...values, ...data };
      } else if (type === 'select') {
        selectData.forEach((selectItem) => {
          const { value = '', label = '' } = selectItem;
          form.setSchemaByPath(selectItem.id, {
            enum: data.map((dataItem: any) => dataItem[value]),
            enumNames: data.map((dataItem: any) => dataItem[label]),
          });
        });
      } else if (type === 'data') {
        if (isTable) {
          // table一般是直接绑定一个接口，该接口所以数据都是给table用
          field.forEach((filedItem) => {
            values = { ...values, [filedItem]: data };
          });
        } else {
          // 只把需要赋值的字段拼接过去，设计时已处理bind字段关联
          values = { ...values, ...pick(data, field) };
        }
      }
    });
    // 详情接口业务产生的数据最后拼接
    values = { ...values, ...detail };
    // 里面有类型校验，后续注意看怎么处理
    // debugger;
    // 我们有watch监听字段，当watch字段在接口提前触发更新的时候，formData已经更新了一轮，注意不要覆盖，数据的优先级后续考虑处理下，默认如果是同一个字段远程的覆盖联动的结果
    values = { ...form.getValues(), ...values };
    form.setValues(values);
    setFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 获取审批历史记录table数据
  const getApproveTableData = useCallback(async () => {
    try {
      const { data: approveLogs = [] } = await FlowService.fetchApproveLogs({
        businessId: query.businessId,
        formId: id,
      });
      setState({
        approveTableData: !approveLogs.length
          ? []
          : approveLogs.map((item: IApproveLogItem) => {
              const list = { ...item };
              const commentRender = [];
              if (item.comment && item.comment.indexOf('\n') > -1) {
                const commentArr = item.comment.split('\n');
                // eslint-disable-next-line no-restricted-syntax
                for (const value of commentArr) {
                  commentRender.push(<p style={{ margin: 0 }}>{value}</p>);
                }
              } else {
                commentRender.push(<p style={{ margin: 0 }}>{item.comment}</p>);
              }
              list.comment = commentRender;
              return item;
            }),
        assigneesName: !approveLogs.length ? '' : approveLogs[0].assigneesName,
      });
    } catch (error) {
      //
    }
  }, [id, query.businessId, setState]);

  useEffect(() => {
    if (query.businessId) {
      getApproveTableData();
    }
  }, [getApproveTableData, query.businessId]);

  // 以前代码里面的业务检验，大部分是根据urlquery参数进行检验
  const checkByQuery = useCallback(async () => {
    const { piId, businessId, taskId, flag, messageType } = query;
    if (flag) {
      // 没权限
      Modal.error({
        title: '无此流程节点查看权限',
        onOk: () => {
          if (isPhone) {
            redirect('#/remindCenter/remindMessage/mobileRemind');
          } else {
            redirect('#/serviceManage/flow/manage');
          }
        },
      });
      return false;
    }
    const checkData = {
      currentUser: initialState.userId || '',
      piId,
      formId: id,
      businessId,
      taskId,
    };

    // 申请、审批表需要检验
    if (messageType === 1) {
      // 检验是否审批
      const msg = await FormService.checkAuth(checkData);
      if (msg.status === 0) {
        // 检验通过可以提交
        setQuery({ fromManage: 0 });
      } else {
        // 检验失败只可以查看
        setQuery({ fromManage: 1 });
      }
    } else if (messageType === 2) {
      // 不需要检验，并且这个情况是不能提交，纯展示详情页面
      setQuery({ fromManage: 1 });
    }
    return true;
  }, [id, initialState.userId, query, setQuery]);

  useEffect(() => {
    if (checkByQuery()) {
      fetchRemoteData();
    }
  }, [id, fetchRemoteData, checkByQuery]);

  /**
   * @description 统一提交接口
   * @param {OperationTypes} type
   * @param {*} values
   * @return {*}
   */
  const handleBtnSubmit = useCallback(
    async (type: OperationTypes, values?: any) => {
      if (type === 'basic') {
        const checkMsg = basicSubmitCheck(initialState);
        if (checkMsg) {
          message.error(checkMsg, 5);
          setState({
            isSubmitting: false,
          });
          return;
        }
      }
      // 整合发送请求的数据
      let data: any = {
        formId: parseInt(id, 10),
        currentUser: initialState.userId,
        formMap: values,
      };

      if (query.businessId) {
        data[['approve', 'recall', 'approve0', 'approve1'].includes(type) ? 'businessId' : 'id'] =
          query.businessId;
      }

      if (type === 'basic') {
        data = {
          ...data,
          managerId: initialState.supervisorId,
          officerId: initialState.officerId,
        };
      } else if (type === 'approve') {
        data = {
          ...data,
          status: 1,
          comment: '',
          taskId: query.taskId,
        };
      } else if (type === 'recall') {
        data = {
          ...data,
          taskId: query.taskId,
        };
        delete data.formMap;
      } else if (['approve0', 'approve1', 'approve2', 'approve3'].includes(type)) {
        data = {
          ...data,
          // 审批状态
          status: approveValues.status,
          // 审批意见
          comment: approveValues.comment || '',
          taskId: query.taskId,
        };
        if (['approve0', 'approve1'].includes(type)) {
          data = {
            ...data,
            status: approveValues.status,
          };
          if (type === 'approve0') {
            // 退回需要拼接退回节点
            data = {
              ...data,
              destActivityId: approveValues.destActivityId,
            };
          }
        }
        // 加签，转签
        if (['approve2', 'approve3'].includes(type)) {
          data = {
            ...data,
            piId: query.piId,
            userIds: approveValues.staffValue,
            comment: approveValues.comment,
            afterFlag: approveValues.afterFlag, // 前加签为0，后加签为1
            taskId: query.taskId, // 3.3期新增 并行网关
          };
        }
      }

      const submitFunc = submitFuncMap[type];

      setState({
        isSubmitting: true,
      });

      try {
        await submitFunc(data);
        let msg = '提交成功！';
        if (type === 'draft') {
          msg = '保存草稿成功！';
        } else if (type === 'recall') {
          msg = '流程已撤回！';
        }
        message.success(msg);
        toRedirectUrl(type, query);
      } catch (error) {
        message.error(error.msg || `${error}`, 5);
      }
      setState({
        isSubmitting: false,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, initialState, query, setState],
  );

  // 审批页的展示审批框的提交审批接口
  const handleApprove = (values: IFlowApproveState = {} as IFlowApproveState) => {
    const { status, afterFlag } = values;
    // 临时变量存储，form.submit无法携带变量
    approveValues = { ...values };

    // 退回审批、转签审批、加签（前加签）不需要检验表单数据
    if (
      [ApproveStatus.return, ApproveStatus.change].includes(status) ||
      (status === ApproveStatus.join && afterFlag === JoinStatus.foward)
    ) {
      handleBtnSubmit(`approve${status}`);
    } else {
      // 走表单自带的检验
      submitType = `approve${status}`;
      form.submit();
    }
  };

  const onFinish = async (data: any, errors: Error[]) => {
    if (errors.length > 0) {
      message.error(`校验未通过：${JSON.stringify(errors.map((item) => item.name))}`);
      return;
    }
    let type: OperationTypes = 'basic';
    if (typeof submitType !== 'undefined') {
      type = submitType;
    } else if (query.taskId) {
      type = 'approve';
    }
    handleBtnSubmit(type, data);
    // await FormService.saveFormData(id, data);
    // message.success('保存成功');
  };

  const beforeFinish = (params: ValidateParams) => {
    const errorFields = errorFieldsRef?.current;
    // 如果有收集到自定义的组件的错误，直接先抛出自定义的错误
    if (errorFields.length) {
      return errorFields;
    }
    return (params.errors as Error[]) || [];
  };

  // 点击取消按钮返回相对应页面
  const handleCancel = useCallback(() => {
    toRedirectUrl('cancel', query);
  }, [query]);

  // 撤回流程
  const handleRecall = useCallback(async () => {
    handleBtnSubmit('recall');
  }, [handleBtnSubmit]);

  const watch = getWatch(schema, form);

  const { isNeedApprove = false, formType } = formBusinessData.formInfo || {};
  const { businessId, taskId, fromManage, canRecall } = query || {};
  const { isSubmitting, approveTableData, assigneesName } = state || {};

  return (
    <Spin spinning={formDataLoading} delay={500}>
      <div className={styles['form-render-container']}>
        <FormRender
          widgets={widgets}
          form={form}
          schema={schema}
          onFinish={onFinish}
          beforeFinish={beforeFinish}
          watch={watch}
          // onMount={onMount}
        />

        {/* 申请表修改历史 */}
        <ModifyHistory></ModifyHistory>

        {/* 需要审批的时候进入需要审批的操作组件，不需要使用默认的操作按钮等 */}
        {isNeedApprove && formType === FormTypes.approve ? (
          <FlowApprove
            approve={handleApprove}
            cancel={handleCancel}
            recall={handleRecall}
            assigneesName={assigneesName}
            canRecall={canRecall}
            taskId={taskId}
          ></FlowApprove>
        ) : (
          <div className={styles['form-render-container__btns']}>
            {/* fromManage === 0 才有提交权限 */}
            {fromManage === 0 && (
              <Button
                loading={isSubmitting}
                disabled={formDataLoading}
                type="primary"
                onClick={form.submit}
              >
                提交
              </Button>
            )}

            <Button type="default" onClick={handleCancel}>
              返回
            </Button>

            {canRecall && (
              <Button type="primary" onClick={handleRecall}>
                撤回
              </Button>
            )}

            {/* 可以提交，并且还没有真实走过流程任务可以保存为草稿 */}
            {fromManage === 0 && !taskId && (
              <Button
                type="default"
                disabled={formDataLoading}
                loading={isSubmitting}
                onClick={() => {
                  submitType = 'draft';
                  form.submit();
                }}
              >
                保存为草稿
              </Button>
            )}
          </div>
        )}

        {/* businessId taskId 存在业务数据和任务id走了流程显示相关流程历史数据 */}
        {businessId && taskId ? <FlowTable data={approveTableData}></FlowTable> : null}

        {/* <div className={styles['form-render-container__btns']}>
          <Button type="primary" onClick={form.submit}>
            提交
          </Button>
        </div> */}
      </div>
    </Spin>
  );
};

export function Wrapper() {
  return useSchema(Run, 'run');
}

export default Wrapper;
