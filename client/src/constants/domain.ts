const { host, protocol } = window.location;

// 如果是qiankun使用qiankun的挂载地址，如果不是直接使用当前运行环境的地址当前缀
/* eslint-disable no-underscore-dangle */
const baseURL = (window as any).__POWERED_BY_QIANKUN__
  ? (window as any).__INJECTED_PUBLIC_PATH_BY_QIANKUN__
  : `${protocol}//${host}`;

export default baseURL;
