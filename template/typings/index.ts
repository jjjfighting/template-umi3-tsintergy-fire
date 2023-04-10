/* 路由配置表的类型 */
type RouteConfig = {
  exact?: boolean;
  title?: string;
  path?: string;
  component?: string;
  icon?: string;
  redirect?: string;
  routes?: RouteConfig[];
  hidden?: boolean;
};

declare const ROUTES: RouteConfig[];

/**
 * 一些需要 import/export 的全局类型，不能写在这个文件，应该写在 src/types.ts
 */
declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'react-resizable';
declare module 'dragm';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
interface Window {
  less: {
    modifyVars: (e: any) => void;
  };
  _hmt: {
    push: (...params: any[]) => void;
  };
}
declare module '*.json' {
  const value: any;
  export default value;
}

/** 深 Partial */
declare type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

// google analytics interface
interface GAFieldsObject {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
}

type PromiseRes<T = any> = Promise<AjaxRes<T>>;

type PROJECT_KEY_TYPE = '<%= projectkey %>';
declare const PROJECT_KEY: PROJECT_KEY_TYPE;

// 辅助决策系统主题样式
type ThemeType = 'light' | 'lightBlue' | 'dark' | 'nd' | 'gary' | 'ny' | 'sf';

declare const PROJECT_NAME: string;
declare const API_PREFIX: string;
declare const ACTIVEAUTH: boolean;
declare const DEV_USERNAME: string;
declare const DEV_PASSWORD: string;
declare const SKIN: ThemeType[];
declare const IS_HUANENG: boolean;

type LocationRes<T = any> = {
  pathname: string;
  search: string;
  hash: string;
  key?: string;
  query: T;
};

type AjaxRes<T = any> = {
  retCode: string;
  retMsg: string;
  data: T;
};

type CrudType = 'create' | 'view' | 'update' | 'delete';

interface OptionObject {
  id: string | number;
  name: string;
  disabled?: boolean;
  children?: OptionObject[];
}

type OptionList = OptionObject[];

interface OrgObj {
  /** 电厂ID/场站ID/售电公司ID */
  orgId: string;
  /** 电厂名称/场站名称/售电公司名称 */
  orgName: string;
}
type OrgList = OrgObj[];
type OrgOptions = (OrgObj & {
  mergeName: string;
  label: string;
  value: string;
})[];
type OrgMap = Map<
  string,
  OrgObj & {
    mergeName: string;
  }
>;

/**
 * 火电 | 新能源 | 售电公司
 */
type systemType = 'FIRE' | 'NE' | 'ES';

declare module '@tsintergy/role';
declare module 'file-saver';
declare module 'xlsx-style-correct';
declare module 'echarts-gl';
declare module 'echarts-gl/charts';
declare module 'echarts-gl/components';
declare module '@loadable/component';
