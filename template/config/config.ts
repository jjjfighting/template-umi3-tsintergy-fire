import { defineConfig } from 'umi';
import { proxyMap } from '../../../scripts/meta';
import routes from './routes';
import { theme, skin } from './theme';

const basePath = '/<%= basepath %>';
const API_PREFIX = '/<%= basepath %>';

const { PROJECT_KEY, PROXY_KEY } = process.env;
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  title: '山东辅助决策系统',
  favicon: `${basePath}/image/favicon.png`,
  theme,
  routes,
  base: basePath,
  publicPath: `${basePath}/`,
  outputPath: '../../dist/<%= projectkey %>',
  define: {
    PROJECT_KEY,
    API_PREFIX,
    ROUTES: routes,
    SKIN: skin, // 开放的皮肤
    IS_HUANENG: false, // 是否为华能环境
  },
  metas: [
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Expires',
      content: '0',
    },
  ],
  // @ts-ignore
  proxy: proxyMap[PROXY_KEY]?.({
    API_PREFIX,
    YApiPathRewrite: {
      '^/': '/mock/101022/',
    },
  }),
  nodeModulesTransform: {
    type: isDev ? 'none' : 'all',
  },
  hash: true,
  ignoreMomentLocale: true,
  locale: {
    antd: true,
  },
  antd: {},
  dva: {
    hmr: true,
    disableModelsReExport: true,
    lazyLoad: true,
  },
  webpack5: {},
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  mfsu: {},
  chunks: isDev ? ['umi'] : ['vendors', 'umi'],
  chainWebpack(config: any, { webpack }: any) {
    config.merge({
      // 解决xlsx-style-correct会报'../xlsx'找不到的错误
      externals: [
        {
          '../xlsx': 'var _XLSX',
        },
      ],
      optimization: isDev
        ? {}
        : {
            minimize: true,
            splitChunks: {
              chunks: 'all',
              minSize: 30000,
              minChunks: 2,
              automaticNameDelimiter: '.',
              cacheGroups: {
                vendor: {
                  name: 'vendors',
                  test({ resource }: any) {
                    return /[\\/]node_modules[\\/]/.test(resource);
                  },
                  priority: 10,
                },
              },
            },
          },
    });
  },
});
