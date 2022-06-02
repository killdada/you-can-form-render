import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: 'build',
  define: {
    'process.env.REACT_APP_DOMAIN': 'https://form-render-server.yenmysoft.com.cn',
    'process.env.REACT_APP_ENV': 'dev',
  },
});
