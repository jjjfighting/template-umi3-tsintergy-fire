export const ExceptionRoutes = [
  {
    path: '/Exception',
    routes: [
      {
        title: '403',
        path: '/Exception/403',
        component: '@/pages/common/Exception/403',
      },
      {
        title: '404',
        path: '/Exception/404',
        component: '@/pages/common/Exception/404',
      },
      {
        title: '500',
        path: '/Exception/500',
        component: '@/pages/common/Exception/500',
      },
      {
        title: 'Incompatible',
        path: '/Exception/Incompatible',
        component: '@/pages/common/Exception/Incompatible',
      },
      {
        title: 'InitException',
        path: '/Exception/InitException',
        component: '@/pages/common/Exception/InitException',
      },
    ],
  },
];

/* 开发者模式路由 */
export const devRoutes = [
  // { exact: true, path: '/', redirect: '/SpotMarket/MarketBoard' },
  {
    title: '登录',
    path: '/Login',
    component: '@/pages/common/Login',
  },
];

// 公共导航路由
export const contentCommon = [
  {
    title: '',
    path: '/Iframe',
    component: '@/pages/common/Iframe',
    icon: 'wangjiatu',
  },
];
