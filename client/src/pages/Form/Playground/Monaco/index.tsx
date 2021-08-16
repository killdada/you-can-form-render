import type { FC } from 'react';
import React, { useCallback, useEffect } from 'react';
import type { monaco } from 'react-monaco-editor';
import MonacoEditor from 'react-monaco-editor';

import type { TValueKey, Range } from '@/types';

import { valueMap, keySuggestions } from './suggestionsMap';

let editor: monaco.editor.IStandaloneCodeEditor;

const Monaco: FC<{
  value: string;
  onChange?: (schemaStr: string) => void;
  options?: any;
}> = ({ value, onChange, options }) => {
  const editorWillMount = useCallback((monacoInstance: any) => {
    editor = monacoInstance.languages.registerCompletionItemProvider('json', {
      provideCompletionItems: (model: any, position: any) => {
        // 得到冒号之前的文本
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const word = model.getWordUntilPosition(position);
        const range: Range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        let propKey: TValueKey;
        const match = textUntilPosition.match(/[a-z]+(?=["][:])/);
        if (match && match.length) {
          propKey = match[0] as TValueKey;
        }
        const suggestions = propKey ? valueMap(range)[propKey] || [] : keySuggestions(range);
        return { suggestions };
      },
      triggerCharacters: ['"'],
    });
  }, []);

  useEffect(() => {
    return () => {
      // 记得清理掉提示，尝试在实列里面 Dispose可能有问题导致提示没有清除 https://github.com/Automattic/simplenote-electron/blob/06edf9dc27d71ffeb6dc763ffe55a7c87c31b85a/lib/note-content-editor.tsx#L822 源码这里实际提示注册的时候可以这样清除下提示 （如果不清楚提示实例会导致每次进入同一个label提示都会重复加1）
      editor.dispose();
    };
  }, []);

  return (
    <MonacoEditor
      height="800px"
      language="json"
      value={value}
      onChange={onChange}
      editorWillMount={editorWillMount}
      options={options}
    />
  );
};

export default Monaco;
