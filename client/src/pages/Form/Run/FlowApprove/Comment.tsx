import type { FC } from 'react';
import { memo, useState, useEffect, useRef } from 'react';

import type { FormInstance } from 'antd';
import type { CustomFormItemProps, IOPINION } from '@/types';
import ProForm, { ProFormList, ProFormText, ModalForm } from '@ant-design/pro-form';
import { Button, Select, message } from 'antd';
import { FlowService } from '@/service';

import { checkArrayIsRepeat } from '@/utils';

// 审批常用意见
const FlowApproveComment: FC<CustomFormItemProps<string>> = ({ onChange }) => {
  const formRef = useRef<FormInstance>();
  const [opinionList, setOpinionList] = useState<IOPINION[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getOpinionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOpinionList = async () => {
    try {
      const { data = [] } = await FlowService.getOpinions();
      setOpinionList(data);
      formRef.current?.setFieldsValue({ opinionList: data });
    } catch (error) {
      //
    }
  };

  const onFinish = async ({ opinionList: opinions = [] }) => {
    if (checkArrayIsRepeat(opinions, 'opinionInfo')) {
      message.warn('常用意见不能重复！');
      return false;
    }
    try {
      await FlowService.saveOpinions(opinions.map((item: IOPINION) => item.opinionInfo));
      setOpinionList(opinionList);
      message.success('常用意见保存成功！');
    } catch (error) {
      message.error(error.message || error.msg || error);
      return false;
    }
    return true;
  };

  // label,value都用他的label信息即可，新增删除都是全量替换的
  const options = opinionList.map((item) => ({
    value: item.opinionInfo,
    label: item.opinionInfo,
  }));

  return (
    <div className="user-common-comment flex">
      <Select
        style={{ width: '400px', marginRight: '24px' }}
        options={options}
        placeholder="请选择常用意见"
        onChange={onChange}
      />

      <ModalForm
        visible={show}
        layout="horizontal"
        width="900px"
        title="添加常用意见"
        formRef={formRef}
        trigger={<Button onClick={() => setShow(true)}>添加</Button>}
        onFinish={onFinish}
        onVisibleChange={setShow}
      >
        <ProFormList
          name="opinionList"
          creatorButtonProps={{
            position: 'bottom',
          }}
        >
          <ProForm.Group size={8}>
            <ProFormText name="opinionInfo" />
          </ProForm.Group>
        </ProFormList>
      </ModalForm>
    </div>
  );
};

export default memo(FlowApproveComment);
