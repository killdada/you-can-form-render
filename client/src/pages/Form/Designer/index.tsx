import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useModel, Prompt, history } from 'umi';
import { isEqual, set } from 'lodash-es';

import Generator from 'fr-generator';

import type { RemoteBindData, WrapperSchemaProps } from '@/types';
import { IS_DEV_MODE } from '@/constants';

import { designerWidgets, runWidgets } from '../Widgets';
import { defaultSettings, defaultCommonSettings, defaultGlobalSettings } from './settings';
import { useSchema } from '../hooks';

import './index.less';

// 自定义组件集合
const widgets = {
  ...designerWidgets,
  ...runWidgets,
};

const Designer: FC<WrapperSchemaProps> = ({ id, isEdit }) => {
  const { generatorRef, saveSchemaData, getFormSchemaData, schema } = useModel(
    'schemaModel',
    (model) => ({
      schema: model.schema,
      generatorRef: model.generatorRef,
      saveSchemaData: model.saveSchemaData,
      getFormSchemaData: model.getFormSchemaData,
    }),
  );

  const { initFormDesignData } = useModel('formModel', (model) => ({
    initFormDesignData: model.initFormDesignData,
  }));

  const { setCurrentSelectField } = useModel('fieldsModel', (model) => ({
    setCurrentSelectField: model.setCurrentSelectField,
  }));

  useEffect(() => {
    // 根据加载schema.data 表单数据绑定schema获取本地、第三方数据库数据
    initFormDesignData(schema?.formDataBind as RemoteBindData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extraButtons = [
    true,
    true,
    true,
    true,
    // 新增官方的playground 方便用户使用
    {
      text: '高级编辑',
      type: 'primary',
      title: '推荐比较清楚配置对应的关系再使用该功能。',
      onClick: () => {
        history.push(`/playground/${id}`);
      },
    },
    {
      text: '保存',
      type: 'primary',
      onClick: () => saveSchemaData(id),
    },
  ];

  // 开发模式本地调试，直接跳转到run 运行页面测试
  if (IS_DEV_MODE) {
    extraButtons.push({
      text: '预览',
      type: 'primary',
      onClick: async () => {
        history.push(`/run/${id}`);
      },
    });
  }

  const globalSetting = defaultGlobalSettings;
  // 编辑表单配置不允许更改下面的这几个字段
  if (isEdit) {
    set(globalSetting, 'properties.formType.disabled', true);
    set(globalSetting, 'properties.relFormId.disabled', true);
    set(globalSetting, 'properties.isNeedApprove.disabled', true);
  }

  // 更新当前节点选中的信息
  const onCanvasSelect = (data: any) => {
    setCurrentSelectField(data);
  };

  return (
    <div style={{ height: '100vh' }}>
      {/* 用户离开页面时如果本地配置没有保存，提示一个选择 */}
      <Prompt
        message={() => {
          return !isEqual(getFormSchemaData(), schema)
            ? '您的配置暂未保存，你确定要离开么？'
            : true;
        }}
      />

      <Generator
        extraButtons={extraButtons}
        defaultValue={schema}
        settings={defaultSettings}
        commonSettings={defaultCommonSettings}
        globalSettings={globalSetting}
        widgets={widgets}
        ref={generatorRef}
        onCanvasSelect={onCanvasSelect}
      />
    </div>
  );
};

export function Wrapper() {
  return useSchema(Designer);
}

export default Wrapper;
