import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.REACT_APP_DOMAIN': '',
    'process.env.REACT_APP_ENV': 'dev',
  },
  // mfsu: {
  //   development: {
  //     output: '.mfsu-development',
  //   },
  // },
});
