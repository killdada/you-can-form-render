import type { FC } from 'react';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useModel } from 'umi';

import type { ProFieldValueType } from '@ant-design/pro-utils';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type {
  IDataBind,
  SelectBindData,
  TableDataBindSetting,
  TableSettingDataSourceType,
} from '@/types';
import { ETableConfig } from '@/types';
import { ERemoteBindType } from '@/types';
import { TableColumnComType } from '@/types';
import { Button, Form } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';

import { tableComMessage, componentByRowType, getApiQuery, optionsToEnum } from '@/utils';
import { FormService } from '@/service';

import './index.less';

// 获取form的默认展示值
const getFormDefaultData = ({
  rowType,
  optionState = {} as SelectBindData,
  isMultiple,
}: TableSettingDataSourceType) => {
  let initVal;
  if (rowType === TableColumnComType.select) {
    if (optionState.dataSourceMethod === ERemoteBindType.fixed) {
      const { defaultVal } = optionsToEnum(
        optionState?.options || [],
        isMultiple ? 'multiple' : 'single',
      );
      initVal = defaultVal;
    } else if (isMultiple) {
      initVal = [];
    }
  }
  return initVal;
};

const MrTable: FC<Generator.CustomComponentsProp<any[]>> = (props) => {
  // console.log(props.schema, 'schema design');

  const { setErrorFields, removeErrorField } = useModel('fieldsModel', (model) => ({
    setErrorFields: model.setErrorFields,
    removeErrorField: model.removeErrorField,
  }));

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [columns, setColumns] = useState<ProColumns<TableSettingDataSourceType>[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const { isAddOrDel, canImport, canExport } = props.schema;
  const hasAdd = !isAddOrDel.includes(ETableConfig.disabledAdd);
  const hasDel = !isAddOrDel.includes(ETableConfig.disabledDel);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value = [], onChange, disabled, readOnly, hidden, schema = {} } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    columnTableDataBind = [] as TableSettingDataSourceType[],
    dataBind = {} as IDataBind,
    $id,
  } = schema;

  const fields = (dataBind.field || []) as TableDataBindSetting[];

  useEffect(() => {
    // 生成table列数据结构
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    generateColumnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnTableDataBind]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    updateDataSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (dataSource && dataSource.length) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      checkTableForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dataSource)]);

  const checkTableForm = async () => {
    // （dataSource value都是实时更改变化），如果不再dataSource改变的时候强制全部重新检验下所有的字段信息，可能会带来检验漏了的情况，大部分字段是在onChange处理，导致检验错误刚开始初始化或者是新增一行数据的时候没有触发检验，或者后期考虑扩展优化fr-generaotr的检验，在按钮提交保存的时候除了走他自带的检验，再增加一些自行各个组件的检验函数处理(扩展自定义组件的检验方法)
    try {
      await form.validateFields();
      removeErrorField(props.addons.dataPath);
    } catch (error) {
      setErrorFields([{ name: props.addons.dataPath, error: ['表格内字段检验失败，请检查！'] }]);
    }
  };

  // 更新处理下table初始化数据
  const updateDataSource = () => {
    if (value && Array.isArray(value) && value.length) {
      setDataSource(value);
      setEditableRowKeys(value.map((item) => item.id));
    }
  };

  // 根据列配置id获取当前数据绑定的时候table列绑定的接口key值，即table dataIndex
  const getDataIndex = (id: string | number) => {
    const fieldItem = fields.find((item) => item.id === id);
    if (fieldItem) {
      return fieldItem.fieldKey;
    }
    return false;
  };

  // 获取每一个列的初始化默认数据
  const getDefaultData = useCallback(() => {
    const result = {} as any;
    fields.forEach((item) => {
      // item里面只有部分字段，我们需要完整的字段用来设置默认值，从columnTableDataBind里面拿
      const optionInfo = columnTableDataBind.find(
        (col: TableSettingDataSourceType) => col.id === item.id,
      );
      if (optionInfo) {
        const initVal = getFormDefaultData(optionInfo);
        if (item.fieldKey) {
          result[item.fieldKey] = initVal;
        }
      }
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnTableDataBind, JSON.stringify(fields)]);

  const defaultBindData = useMemo(() => getDefaultData(), [getDefaultData]);

  // 生成column的每个类型
  const generatorColumnItem = (
    item: TableSettingDataSourceType = {} as TableSettingDataSourceType,
  ) => {
    const {
      id,
      isRequired,
      rowTitle,
      isDisabled,
      isMultiple,
      rowType,
      optionState = {} as SelectBindData,
    } = item;

    // 列配置，组件是否必填
    const rules = isRequired
      ? [
          {
            required: isRequired,
            message: tableComMessage[rowType as keyof typeof tableComMessage],
          },
        ]
      : [];

    // 根据数据绑定组件获取对应组件绑定的id key
    const dataIndex = getDataIndex(id);

    const columnItem: ProColumns = {
      title: rowTitle,
      formItemProps: () => {
        const formItemProps: any = {
          rules,
        };
        return formItemProps;
      },

      fieldProps: () => {
        // 列配置是否禁用
        const filedPorps: any = {
          disabled: isDisabled,
        };
        // 列配置select是否多选单选
        if (rowType === TableColumnComType.select) {
          filedPorps.options = optionState?.options || [];
          if (isMultiple) {
            filedPorps.mode = 'multiple';
          }
        }
        return filedPorps;
      },
    };

    // 部分没有绑定key的可能是无意义的因为提交的时候不知道提交那个字段key，按钮是正常的，因此最后在设计时处理最后强检验下，除了按钮类型其他table字段必须绑定对应key，这里暂时不管，只处理已经绑定的key
    if (dataIndex) {
      columnItem.dataIndex = dataIndex;
    }

    // 根据配置的组件类型rowType，自动映射使用 pro-table里面的 valueType 内置类型映射
    if (rowType === TableColumnComType.button) {
      columnItem.renderFormItem = () => {
        return <Button type="primary">{item.rowTitle}</Button>;
      };
    } else {
      columnItem.valueType = componentByRowType[
        item.rowType as keyof typeof componentByRowType
      ] as ProFieldValueType;
    }

    // 列，select选项配置远程接口数据
    if (
      rowType === TableColumnComType.select &&
      optionState.dataSourceMethod &&
      optionState.dataSourceMethod !== ERemoteBindType.fixed
    ) {
      columnItem.request = async () => {
        try {
          const {
            query,
            value: valueKey = '',
            label = '',
          } = getApiQuery({ data: optionState, id: $id, type: 'select' });

          const { data = [] } = await FormService.fetchRemoteFormData(query);
          return data.map((dataItem: any) => ({
            value: dataItem[valueKey],
            label: dataItem[label],
          }));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `请求table select数据产生错误请检查,${error.message || error.msg || error}`,
          );
          return [];
        }
      };
    }
    return columnItem;
  };

  const generateColumnData = () => {
    let colList: TableSettingDataSourceType[] = columnTableDataBind;
    if (colList && colList.length) {
      // 过滤不显示
      colList = colList.filter((data: TableSettingDataSourceType) => data.isShow);
      const tempColumns: ProColumns<TableSettingDataSourceType>[] = colList.map(
        (item: TableSettingDataSourceType) => {
          return generatorColumnItem(item);
        },
      );

      if (hasDel) {
        tempColumns.push({
          title: '操作',
          valueType: 'option',
          render: () => {
            return null;
          },
        });
      }
      setColumns(tempColumns);
    }
  };

  return (
    <div className="form-render-table">
      <div className="form-render-table-btns mb16">
        {/* {hasAdd && (
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
        >
          新增行
        </Button>
      )} */}
        {canImport && (
          <Button icon={<UploadOutlined />} style={{ marginLeft: 10 }}>
            导入数据
          </Button>
        )}
        {canExport && (
          <Button icon={<DownloadOutlined />} style={{ marginLeft: 10 }}>
            导出数据
          </Button>
        )}
      </div>

      <EditableProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        value={dataSource}
        controlled
        bordered={true}
        recordCreatorProps={
          hasAdd
            ? {
                newRecordType: 'dataSource',
                record: () => ({
                  ...defaultBindData,
                  id: Date.now(),
                }),
              }
            : false
        }
        editable={{
          type: 'multiple',
          form,
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList);
            props.onChange(recordList);
          },
          onChange: setEditableRowKeys,
        }}
      />
    </div>
  );
};

export default MrTable;
