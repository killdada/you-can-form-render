import type { FC } from 'react';
import React, { useState, forwardRef, useImperativeHandle } from 'react';

import FormRender, { useForm } from 'form-render';
import { Tabs } from 'antd';

import type { PlaygroundState, PlaygroundRef } from '@/types';
import MonacoEditor from './Monaco';
import { runWidgets } from '../Widgets';
import { schema2str, schemaStr2Json } from './utils';

const { TabPane } = Tabs;

const widgets = {
  ...runWidgets,
};

const PlaygroundMain: FC<PlaygroundState> = forwardRef<PlaygroundRef, PlaygroundState>(
  ({ schema, ...props }: PlaygroundState, ref) => {
    const form = useForm();
    const [schemaStr, setSchemaStr] = useState(() => schema2str(schema));
    const [errorText, setErrorText] = useState('');

    useImperativeHandle(ref, () => ({
      schemaStr,
      updateSchemaStr: (key: string, value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setSchemaStr(
          schema2str({
            ...schemaStr2Json(schemaStr),
            [key]: value,
          }),
        );
      },
    }));

    const tryParse = (schemaStrVal: string) => {
      let schemaData = {};
      try {
        schemaData = schemaStr2Json(schemaStrVal, true);
        if (typeof schema !== 'object') {
          setErrorText('schema非正确json');
          return false;
        }
        setErrorText('');
        return schemaData;
      } catch (error) {
        setErrorText(String(error));
        return false;
      }
    };

    const handleCodeChange = (schemaStrVal: string) => {
      setSchemaStr(schemaStrVal);
      tryParse(schemaStrVal);
    };

    const schemaJson = schemaStr2Json(schemaStr);

    return (
      <div className="flex-auto flex fr-playground-content">
        <div className="flex flex-column editcontent">
          <Tabs
            defaultActiveKey="1"
            onChange={() => {}}
            className="flex flex-column"
            style={{ overflow: 'auto' }}
          >
            <TabPane tab="Schema" key="1">
              <MonacoEditor value={schemaStr} onChange={handleCodeChange} />
            </TabPane>
            <TabPane tab="Data" key="2">
              <MonacoEditor value={schema2str(form.getValues())} options={{ readOnly: true }} />
            </TabPane>
          </Tabs>
        </div>
        <div className="flex flex-column showcontent">
          <div className="overflow-auto flex-auto" style={{ borderLeft: '1px solid #ddd' }}>
            {errorText ? (
              <div>{errorText}</div>
            ) : (
              <FormRender form={form} schema={schemaJson} widgets={widgets} {...props} />
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default PlaygroundMain;
