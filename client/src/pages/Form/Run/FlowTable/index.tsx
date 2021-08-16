import type { FC } from 'react';
import React from 'react';

import type { IApproveLogItem } from '@/types';
import { Table } from 'antd';
import { getTimeConsume } from '@/utils';
import { isPhone } from '@/constants';

const scroll = isPhone ? { scroll: { x: 800 } } : {};

const columns = [
  {
    title: '节点序号',
    render: (text: any, record: any, index: number) => `${index + 1}`,
    width: 75,
  },
  {
    title: '节点名称',
    dataIndex: 'actName',
    key: 'actName',
    width: 140,
  },
  {
    title: '执行人',
    dataIndex: 'assigneesName',
    key: 'assigneesName',
    width: 140,
  },
  {
    title: '状态',
    dataIndex: 'approveStatusName',
    key: 'approveStatusName',
    width: 75,
  },
  {
    title: '开始时间',
    dataIndex: 'lastApproveTime',
    key: 'lastApproveTime',
    width: 95,
  },
  {
    title: '结束时间',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 95,
  },
  {
    title: '节点耗时',
    dataIndex: 'delayedTime',
    key: 'delayedTime',
    width: 80,
    render: (data: number, row: IApproveLogItem) => {
      return getTimeConsume(data, row.approveStatus);
    },
  },
  {
    title: '处理意见',
    dataIndex: 'comment',
    key: 'comment',
    width: 320,
  },
];

const FlowTable: FC<{ data: IApproveLogItem[] }> = ({ data }) => {
  return (
    <div className="table-in-article">
      <Table
        rowKey="id"
        bordered
        columns={columns}
        dataSource={data}
        pagination={false}
        {...scroll}
        size="middle"
      />
    </div>
  );
};

export default React.memo(FlowTable);
