import type { Route } from '@/types';
import { ROUTERTYPE } from './enum';

export interface AccessTree {
  menu: {
    menupath: string;
    type: 0 | 1 | 2 | 3;
    name: string;
  };
  children?: AccessTree[];
}

// 组装路由对象
export const flattenRoutes = (routerTree: (Route | FIRE_BASE.resourceType)[]): Object => {
  return routerTree.reduce((acc: any, item: Route | FIRE_BASE.resourceType) => {
    const { routes, ...rest } = item;
    if (item.path) {
      acc[item.path] = rest;
    }
    if (item.routes && item.routes.length > 0) {
      return { ...acc, ...flattenRoutes(item.routes) };
    }
    return acc;
  }, {});
};

// 组装netWork路由对象
export const flattenPaths = (routerTree: FIRE_BASE.resourceType[]): Object => {
  return routerTree.reduce((acc: any, item: FIRE_BASE.resourceType) => {
    const { children, ...rest } = item;
    if (item.path) {
      acc[item.path] = rest;
    }
    if (item.children && item.children.length > 0) {
      return { ...acc, ...flattenPaths(item.children) };
    }
    return acc;
  }, {});
};

/**
 * 获取side bar 路由
 * @param netRouter 网络返回路由
 * @param flattenLocalRouter 本地打平的路由
 * @returns
 */
export const getSideRouter = (netRouter: FIRE_BASE.resourceType, flattenLocalRouter: any) => {
  if (!netRouter?.children?.length) {
    return [];
  }
  const originNetSide = netRouter?.children;
  return originNetSide.reduce((total: FIRE_BASE.resourceType[], item: FIRE_BASE.resourceType) => {
    const copyItem = { ...item };
    // 没有path 或者 本地没有注册的路由 丢弃
    if (!copyItem?.path) {
      return [...total];
    }
    // 如果是IFrame 就匹配到IFrame的路由
    if (copyItem?.path?.includes('Iframe?')) {
      copyItem.icon = flattenLocalRouter?.['/Iframe']?.icon;
      delete copyItem.children;
      return [...total, copyItem];
    }
    // 没有有子路由 （是最终节点） 且没有授权 丢弃
    if (!copyItem?.children?.length && !flattenLocalRouter?.[copyItem?.path]) {
      return [...total];
    }
    // 设置了hidden的 隐藏
    if (flattenLocalRouter?.[copyItem?.path]?.hidden) {
      return [...total];
    }
    // 获取本地icon
    copyItem.icon = flattenLocalRouter?.[copyItem?.path]?.icon;
    // 查看 底下的 children 是否有 菜单的页面 没有的话，它是最终节点
    if (copyItem?.children?.length && copyItem?.children.some((v) => v.type === ROUTERTYPE.MEUN)) {
      // 轮询变成 routes
      copyItem.routes = getSideRouter(copyItem, flattenLocalRouter);
      delete copyItem.children;
    }
    return [...total, copyItem];
  }, []);
};
