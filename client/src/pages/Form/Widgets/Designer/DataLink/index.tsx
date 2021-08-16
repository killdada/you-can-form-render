import type { FC } from 'react';
import React, { useState, useRef, useEffect } from 'react';

import { Button, Modal } from 'antd';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import type { ModalRef, DataLinkItem } from '@/types';

import EditModal from './EditModal';

import './index.less';

const DataLink: FC<Generator.CustomComponentsProp<DataLinkItem[]>> = (props) => {
  const { value = [] } = props;

  const [show, setShow] = useState(false);
  const [dataLinkList, setDataLinkList] = useState<DataLinkItem[]>(value as DataLinkItem[]);

  useEffect(() => {
    setDataLinkList(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  const onFinish = async (values: DataLinkItem, isEdit: boolean) => {
    const data = [...value];
    if (!isEdit) {
      data.push(values);
    } else {
      const editIndex = value.findIndex((item) => item.id === values.id);
      data.splice(editIndex, 1, values);
    }
    if (props.onChange) {
      props.onChange(data);
    }
  };

  const editModalRef = useRef<ModalRef<DataLinkItem>>();

  const columns: ProColumns<DataLinkItem>[] = [
    {
      title: '联动名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      width: '40%',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: '' },
        true: {
          text: '是',
          status: true,
        },
        false: {
          text: '否',
          status: false,
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'desc',
      search: false,
      ellipsis: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <a
          key="view"
          onClick={() => {
            editModalRef.current?.open(record, true);
          }}
        >
          编辑
        </a>,
        <a
          onClick={() => {
            if (props.onChange) {
              props.onChange(value.filter((item) => item.id !== record.id));
            }
          }}
          key="delete"
        >
          删除
        </a>,
      ],
    },
  ];

  const handleSearch = ({
    name = '',
    isEnable = 'all',
  }: {
    name: string;
    isEnable: 'all' | 'true' | 'false';
  }) => {
    const data = value.filter((item) => {
      const nameFilter = item.name.includes(name);
      const isEnableFilter =
        isEnable === 'all' ||
        (item.isEnable && isEnable === 'true') ||
        (!item.isEnable && isEnable === 'false');
      return nameFilter && isEnableFilter;
    });
    setDataLinkList(data);
  };

  return (
    <>
      <Button
        title="请注意，如果配置该联动效果，那么高级编辑内置支持的联动函数设置会冲突等！"
        type="primary"
        onClick={() => setShow(true)}
        className="mt16 mb16"
      >
        数据联动列表
      </Button>
      <Modal
        width="800px"
        title="数据联动列表"
        visible={show}
        forceRender={true}
        destroyOnClose={true}
        wrapClassName="data-link-modal"
        footer={null}
        onCancel={() => setShow(false)}
      >
        <ProTable<DataLinkItem>
          columns={columns}
          dataSource={dataLinkList}
          rowKey="id"
          options={false}
          pagination={false}
          bordered
          search={{
            collapsed: false,
            collapseRender: false,
            optionRender: ({ searchText }, { form }) => {
              const defaultSearchArray = [
                <Button
                  key="search"
                  type="primary"
                  onClick={() => handleSearch(form?.getFieldsValue())}
                >
                  <SearchOutlined />
                  {searchText}
                </Button>,
              ];
              return defaultSearchArray;
            },
          }}
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() =>
                editModalRef.current?.open(
                  {
                    id: Date.now(),
                    isEnable: true,
                  } as DataLinkItem,
                  false,
                )
              }
            >
              新建
            </Button>,
          ]}
        />
        <EditModal ref={editModalRef} onFinish={onFinish}></EditModal>
      </Modal>
    </>
  );
};

export default DataLink;
