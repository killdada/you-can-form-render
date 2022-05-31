import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.REACT_APP_DOMAIN': '',
    'process.env.REACT_APP_ENV': 'dev',
  },

  copy: [{
    from: 'mock-dist',
    to: 'mock-dist',
  },
  {
    from: 'mock/json',
    to: 'mock-dist/json',
  }],
  // mfsu: {
  //   production: {},
  // },
});
