interface DataItem {
  // 都是用id作为rowKey
  id: string | number | React.Key;
  [argName: string]: any;
}

/**
 * @description 检查查询条件，选项列表的部分值是否重复
 * @returns rules 检验需要的结构数据
 * @param dataSource 传入的现在的数组，根据这个数据进行去重
 * @param message 检验错误的提示文字,
 * @param key dataSource 检验重复的数组里面对应的需要检验的key值
 */
export const getCheckValRepeatRule = <T extends DataItem>({
  dataSource,
  message,
  key,
}: {
  dataSource: T[];
  message: string;
  key: string;
}): { validator: any; message: string } => {
  return {
    validator(data: any, val: string | number | boolean) {
      const id = (data as any).field.replace(/(\..*)/, '');
      // 判断是否存在重复的key,此时判断的dataSource 是点保存后的值去判断的，正在编辑的值目前没有同步保存
      const unique = !dataSource.some((item) => item.id !== id && item[key] === val);
      if (unique) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(`${message}不能重复（判断来源已保存的列表值）!`));
    },
    message: `${message}不能重复（判断来源已保存的列表值）!`,
  };
};
