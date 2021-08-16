// 从x-rendercopy来的目录，改造ts后声明的类型
export interface PlaygroundState {
  column: number;
  displayType: 'column' | 'row';
  labelWidth: number;
  readOnly: boolean;
  [key: string]: any;
}

export interface Range {
  startLineNumber: string | number;
  endLineNumber: string | number;
  startColumn: string | number;
  endColumn: string | number;
}

export interface IValueData {
  label: string;
  insertText: string;
  kind: any;
  range: Range;
  detail: string;
}

export type TValueKey = 'widget' | 'type' | 'format' | 'displayType' | undefined;

/**
 * @description
 */
export type PlaygroundRef = {
  /**
   * @description 获得当前schema编辑器里面的str
   */
  schemaStr: string;
  /**
   * @description 更新schemaStr
   * @param key 需要更新的全局key
   * @param value 需要更新的全局key对应的value
   */
  updateSchemaStr: (key: string, value: any) => void;
} | null;
