/* eslint-disable */
import type { FC } from 'react';
import React from 'react';
import { Card } from 'antd';
import { useModel } from 'umi';

// 表单修改历史
const ModifyHistory = () => {
  const { getFormBusinessDataByKey } = useModel('schemaModel', (model) => ({
    getFormBusinessDataByKey: model.getFormBusinessDataByKey,
  }));

  const editRecord = getFormBusinessDataByKey('processRecord.editRecord', false);
  if (!editRecord) return null;

  /** 渲染申请表修改记录 */
  const processRecordRender = (data: string) => {
    const arr = data.split('\n'); // 先按照字段截取（一个字段一行）
    const content = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        if (arr[i].indexOf('由【') >= 0) {
          const p1 = arr[i].split('由【')[0];
          const p = arr[i].split('由【')[1];
          const p2 = p.split('改为【')[0];
          const p3 = p.split('改为【')[1];
          content.push(
            <li className="process-record" key={i}>
              <span>{p1}</span>
              <b style={{ color: 'red' }}>由</b>【<span>{p2}</span>
              <b style={{ color: 'red' }}>改为</b>【<span>{p3}</span>
            </li>,
          );
        } else {
          content.push(
            <li className="process-record" key={i}>
              {arr[i]}
            </li>,
          );
        }
      }
    }
    return content;
  };

  return (
    <Card
      title="表单修改历史"
      bodyStyle={{ paddingBottom: 0 }}
      style={{ marginBottom: 20, borderBottom: 'none', marginTop: 0 }}
    >
      <div style={{ overflow: 'auto' }}>
        <ul>{processRecordRender(editRecord)}</ul>
      </div>
    </Card>
  );
};

export default React.memo(ModifyHistory);
