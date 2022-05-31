import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.REACT_APP_DOMAIN': '',
    'process.env.REACT_APP_ENV': 'dev',
  },
  proxy: {
    '/api': {
      target: "http://localhost:7001",
      changeOrigin: true,
      disableHostCheck: true,
    },
  }
  // mfsu: {
  //   development: {
  //     output: '.mfsu-development',
  //   },
  // },
});
