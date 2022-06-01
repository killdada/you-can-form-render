import { defineConfig } from 'umi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import routes from './routes';

// 构建是否需要复制文件到dist
const isCopy = !!process.env.COPY

export default defineConfig({
  title: 'form-render',
  mountElementId: 'web-form-render',
  hash: true,
  antd: {},
  outputPath: './dist',
  history: { type: 'hash' },
  dva: {
    hmr: true,
    immer: true,
    // dynamicImport: undefined,  // this depend on your business logic.
  },
  favicon: '/favicon.ico',
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  chainWebpack(config) {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin);
  },
  define: {
    'process.env.REACT_APP_DOMAIN': '',
    'process.env.REACT_APP_ENV': 'dev',
  },
  // 加入mfsu，monaco-editor出现了一些问题
  // webpack5: {},
  // dynamicImport: {},
  // mfsu: {},
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  copy: isCopy ? [{
    from: 'mock-dist',
    to: 'mock-dist',
  },
  {
    from: 'mock/json',
    to: 'mock-dist/json',
  }] : [],
});
