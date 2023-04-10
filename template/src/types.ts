import type { FC } from 'react';
import type { IRouteComponentProps } from 'umi';

interface IComponent extends FC {
  getInitialProps?: Function;
  preload?: () => Promise<any>;
}

export interface Route {
  path?: string;
  exact?: boolean;
  redirect?: string;
  component?: IComponent;
  routes?: Route[];
  key?: any;
  strict?: boolean;
  sensitive?: boolean;
  wrappers?: any[];

  title: string;
  hidden: boolean;
}

/**
 * 页面组件的 Props
 */
export interface RouteProps<P = any, Q = any> extends IRouteComponentProps<P, Q> {
  route: Route;
}
