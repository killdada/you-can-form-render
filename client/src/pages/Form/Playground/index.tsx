import type { FC } from 'react';
import React, { useRef } from 'react';
import { history, Prompt, useModel } from 'umi';
import { useSetState } from 'ahooks';
import { isEmpty } from 'lodash-es';

import { Select, Switch, Slider, Button } from 'antd';

import { IS_DEV_MODE } from '@/constants';
import type { PlaygroundRef, PlaygroundState, WrapperSchemaProps } from '@/types';

import { useSchema } from '../hooks';
import PlaygroundMain from './main';
import { schema2str, schemaStr2Json } from './utils';

import './index.less';

const { Option } = Select;

const defaultGlobalSetting: PlaygroundState = {
  column: 1,
  displayType: 'column',
  readOnly: false,
  labelWidth: 120,
};

// 该目录下大部分文件直接copy x-render 里面的playground
const Playground: FC<WrapperSchemaProps> = ({ id }) => {
  const { saveSchemaData, schema } = useModel('schemaModel', (model) => ({
    saveSchemaData: model.saveSchemaData,
    schema: model.schema as PlaygroundState,
  }));
  const playgroundRef = useRef<PlaygroundRef>();
  const [state, setState] = useSetState<PlaygroundState>(
    isEmpty(schema)
      ? {
          ...defaultGlobalSetting,
        }
      : {
          displayType: schema.displayType,
          column: schema.column,
          readOnly: schema.readOnly,
          labelWidth: schema.labelWidth,
        },
  );

  const onSave = async () => {
    const schemaData = schemaStr2Json(playgroundRef.current?.schemaStr as string, true);
    saveSchemaData(id, schemaData);
  };

  const onChangeGlobal = (key: string, value: any) => {
    setState({ [key]: value });
    playgroundRef.current?.updateSchemaStr(key, value);
  };

  const { readOnly, labelWidth, displayType, column } = state;

  const showDescIcon = displayType === 'row';

  return (
    <div className="fr-playground">
      <Prompt
        message={() =>
          playgroundRef.current?.schemaStr !== schema2str(schema)
            ? '您的配置暂未保存，你确定要离开么？'
            : true
        }
      />

      <div className="flex setting-container">
        <div>
          <Button type="primary" onClick={() => history.push(`/design/${id}`)}>
            普通编辑
          </Button>
          <Button style={{ marginLeft: 24 }} type="primary" onClick={onSave}>
            保存
          </Button>
          {/* 开发模式本地调试，直接跳转到run 运行页面测试 */}
          {IS_DEV_MODE && (
            <Button
              style={{ marginLeft: 24 }}
              type="primary"
              onClick={() => history.push(`/run/${id}`)}
            >
              预览
            </Button>
          )}
        </div>
        <div className="flex items-center flex-wrap">
          <Select
            style={{ marginRight: 8, marginLeft: 24 }}
            onChange={(value) => {
              onChangeGlobal('column', value);
            }}
            value={column}
          >
            <Option value={1}>一行一列</Option>
            <Option value={2}>一行二列</Option>
            <Option value={3}>一行三列</Option>
          </Select>
          <Select
            style={{ marginRight: 8 }}
            onChange={(value) => {
              onChangeGlobal('displayType', value);
            }}
            defaultValue="column"
          >
            <Option value="column">上下排列</Option>
            <Option value="row">左右排列</Option>
          </Select>
          <Switch
            style={{ marginRight: 8 }}
            checkedChildren="编辑"
            onChange={(value) => {
              setState({ readOnly: value });
            }}
            unCheckedChildren="只读"
            checked={readOnly}
          />
          <div style={{ width: 70 }}>标签宽度：</div>
          <Slider
            style={{ width: 80 }}
            max={200}
            min={20}
            value={labelWidth}
            onChange={(value) => {
              onChangeGlobal('labelWidth', value);
            }}
          />
        </div>
      </div>
      <PlaygroundMain {...state} schema={schema} showDescIcon={showDescIcon} ref={playgroundRef} />
    </div>
  );
};

export function Wrapper() {
  return useSchema(Playground);
}

export default Wrapper;
