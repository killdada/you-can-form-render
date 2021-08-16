import { useBoolean } from 'ahooks';

// 收集一些form的全全局配置信息
export default function useConfigModel() {
  // 当前是否是设计时，不是设计时就是运行时
  const [isDesign, { setTrue, setFalse }] = useBoolean(false);
  return {
    isDesign,
    setIsDesignTrue: setTrue,
    setIsDesignFalse: setFalse,
  };
}
