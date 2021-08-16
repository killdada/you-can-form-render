import type { FC } from 'react';
import React, { useState, useRef } from 'react';

import arrayMove from 'array-move';
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { Form, Checkbox, message, Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';

import type { IOptions, CustomFormItemProps, TOptionsType } from '@/types';
import { getCheckValRepeatRule } from '../utils';

import './index.less';

const maxLength = 10;

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = sortableElement((props: any) => <tr {...props}>{props.children}</tr>);
const SortableContainer = sortableContainer((props: any) => <tbody {...props} />);

interface FixedOptionsProps extends CustomFormItemProps<IOptions[]> {
  type: TOptionsType;
}

// 自定义表单控件，处理表单绑定接口、select等下拉框绑定接口需要的查询参数
const FixedOptions: FC<FixedOptionsProps> = ({ value = [], type, onChange }: FixedOptionsProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<IOptions[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 删除一行参数
  const deleteDataSource = (record: IOptions) => {
    const data = dataSource.filter((item) => item.id !== record.id);
    setDataSource(data);
    // 别忘记清下对应正在编辑的editkeys
    setEditableRowKeys(editableKeys.filter((item) => item !== record.id));
    if (onChange) {
      onChange(data);
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMove(([] as IOptions[]).concat(dataSource), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      setDataSource(newData);
      if (onChange) {
        onChange(newData);
      }
    }
  };

  const DraggableContainer = (props: any) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="options-row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({
    className,
    style,
    ...restProps
  }: {
    [x: string]: any;
    className: any;
    style: any;
  }) => {
    const index = dataSource.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  // width 对应的dragitem也需要设置对应的值，不清楚dragitem tr整个样式的错位，这里手动同步约束下 （后续看sortableElement方法如何和现有的tr样式同步，而不是人为约束）
  const columns: ProColumns<IOptions>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: '60px',
      className: 'drag-visible',
      render: () => <DragHandle />,
      renderFormItem: () => <DragHandle />,
    },
    {
      title: '显示文本',
      key: 'label',
      dataIndex: 'label',
      width: '120px',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '显示文本是必填项！',
            },
            getCheckValRepeatRule<IOptions>({
              dataSource,
              key: 'label',
              message: '显示文本',
            }),
          ],
        };
      },
    },
    {
      title: '选项值',
      key: 'value',
      dataIndex: 'value',
      width: '120px',
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: '选项值是必填项！',
            },
            getCheckValRepeatRule<IOptions>({
              dataSource,
              key: 'value',
              message: '选项值',
            }),
          ],
        };
      },
    },
    {
      title: '是否默认',
      key: 'default',
      dataIndex: 'default',
      width: '90px',
      render: (text: any) => {
        return text ? '是' : '否';
      },
      renderFormItem: (schema, config, formInstance) => {
        const data: IOptions = (schema as any).entry;
        const forms = formInstance.getFieldsValue() || {};
        // 用data.default赋值，onchange的时候这个值渲染的还是旧的，用实时的值，刚开始forms新增可能存在空，空的话就用data.default
        const checked = forms[data.id] ? forms[data.id].default : data.default;
        return (
          <Checkbox
            checked={checked}
            onChange={(e) => {
              // 设置当前选中，并且把其他的default更新下
              let formData = {};
              const val = e.target.checked;
              dataSource.forEach((item) => {
                if (item.id === data.id) {
                  // 更新当前的值
                  formData = {
                    ...formData,
                    [item.id]: { default: val },
                  };
                } else if (val && type === 'single') {
                  // 其他设置为false
                  formData = {
                    ...formData,
                    [item.id]: { default: false },
                  };
                }
              });
              formInstance.setFieldsValue(formData);
              // setFiledsValue只能更新正在编辑的行，导致不在编辑状态下的数据的选中状态没有处理，对不在编辑行的时候需要手动更新dataSouce
              if (val && type === 'single') {
                const res = dataSource.map((item) => {
                  let list = { ...item };
                  if (item.id === data.id) {
                    // 当前行的其他数据还没有同步更新当dataSource导致之前编辑的内容丢失，实时取当前正在编辑的值赋值
                    const formVals = formInstance.getFieldsValue() || {};
                    const formItemData = formVals[data.id];
                    list = {
                      ...list,
                      label: formItemData.label,
                      value: formItemData.value,
                      default: formItemData.default,
                    };
                  } else if (item.id !== data.id && !editableKeys.includes(item.id)) {
                    // 其他不在编辑行的状态直接设置值，其他编辑行的状态最上面的 setFieldsValue已经处理
                    list.default = false;
                  }
                  return list;
                });
                setDataSource(res);
              }
            }}
          >
            是
          </Checkbox>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '160px',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a key="delete" onClick={() => deleteDataSource(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <div className="options-container">
      <EditableProTable<IOptions>
        rowKey="id"
        bordered
        maxLength={maxLength}
        actionRef={actionRef}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        recordCreatorProps={false}
        columns={columns}
        request={async () => ({
          data: value,
          total: value.length,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          type: 'multiple',
          editableKeys,
          form,
          onlyAddOneLineAlertMessage: '只能同时新增一行，请先保存！',
          onChange: setEditableRowKeys,
          onSave: async (id, data) => {
            // 调用组件对应的 onChange方法更新到父级
            const result: IOptions[] = dataSource.map((item: IOptions) => {
              let list = { ...item };
              if (item.id === id) {
                list = {
                  ...item,
                  ...data,
                };
              }
              return list;
            });
            if (onChange) {
              onChange(result);
            }
          },
          actionRender: (record, config, dom) => {
            return [
              dom.save,
              // 不需要默认delete的删除弹窗确认
              <a key="delete" onClick={() => deleteDataSource(record)}>
                删除
              </a>,
            ];
          },
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          if (dataSource.length === maxLength) {
            message.warn(`最多只能添加${maxLength}行！`);
            return;
          }
          const record = {
            id: (Math.random() * 1000000).toFixed(0),
            label: '',
            value: '',
            default: false,
          };
          const formVals = form.getFieldsValue() || {};
          const editorKeys = Object.keys(formVals);

          // 确保正在编辑的还未保存的数据不丢失，实时通过getFieldsValue去取值
          const res = dataSource.map((item) => {
            let list = { ...item };
            if (editableKeys.includes(item.id)) {
              const formItemData = formVals[item.id];
              list = {
                ...list,
                label: formItemData.label,
                value: formItemData.value,
                default: formItemData.default,
              };
            }
            return list;
          });
          setDataSource(res.concat([record]));
          setEditableRowKeys(editorKeys.concat([record.id]));
        }}
        icon={<PlusOutlined />}
      >
        新建一行
      </Button>
    </div>
  );
};

export default FixedOptions;
