import { defineConfig } from 'umi';

export default defineConfig({
  favicon: '/<%= basepath %>/image/favicon_huaneng.png',
  define: {
    IS_HUANENG: true, // 是否为华能环境
  },
});
