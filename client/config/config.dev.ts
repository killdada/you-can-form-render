import { defineConfig } from 'umi';

export default defineConfig({
  proxy: {
    '/api': {
      target: "http://localhost:7001",
      changeOrigin: true,
      disableHostCheck: true,
    },
  }
});
