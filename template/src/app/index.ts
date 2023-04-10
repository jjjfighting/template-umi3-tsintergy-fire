import {
  getAccessRequest,
  getEnumTypeRequestSxFire,
  getLoginUrls,
  getPFUserInfoRequest,
  getUnitInfo,
  querySysParameter,
} from '@/services/commonServices';
import type { Route } from '@/types';
import { flattenPaths, flattenRoutes, getSideRouter } from '@/utils/accessControl';
import { configCalcGlobalOptions } from '@tsintergy/calc';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { casErrorHandler, errorHandle, setTheme } from './config';
import responseConfig from './responseConfig';

const noRequestPaths = ['/Login'];
// calc 全局配置
configCalcGlobalOptions({ fixed: 2 });

moment.locale('zh-cn');

// 运行时 项目初始化
export async function getInitialState() {
  setTheme(); // 设置主题: 山东火电和山东集团默认黑色主题

  let access: any = {};
  let routes: Record<string, Route> = {};
  let sysParameter: any = {};
  let userInfo: FIRE_BASE.PFUserInfoType = {};
  let commonEnum: any = {};
  let unitList: FIRE_BASE.Units[] = [];
  let sideBarRouter: FIRE_BASE.resourceType[] = [];
  let systemUrls: FIRE_BASE.systemUrlsType = {};
  const documentAny: any = document;
  // Internet Explorer 6-11
  const isIE = /* @cc_on!@ */ false || !!documentAny.documentMode;
  const requestBasePath = noRequestPaths.some((p: string) => window.location.pathname.includes(p));

  if (!isIE && !requestBasePath) {
    try {
      const [
        getAccessResp,
        getLoginUrlsResp,
        getUserInfoResp,
        getUnitInfoResp,
        getEnumTypeResp,
        querySysParameterResp,
      ] = await Promise.all([
        getAccessRequest(),
        getLoginUrls(),
        getPFUserInfoRequest(),
        getUnitInfo(),
        getEnumTypeRequestSxFire(),
        querySysParameter(),
      ]);
      const originRouter = getAccessResp.data;
      systemUrls = getLoginUrlsResp.data;
      userInfo = getUserInfoResp.data;
      unitList = getUnitInfoResp.data;
      commonEnum = getEnumTypeResp.data; // 注意山西火电枚举没有分公司信息
      sysParameter = querySysParameterResp?.data || {};
      const contentRoutes: any = ROUTES?.find((p) => p.title === 'content')?.routes;
      sideBarRouter = getSideRouter(originRouter, flattenRoutes(contentRoutes));
      access = flattenPaths(originRouter.children);
      routes = flattenRoutes(contentRoutes) as any;
    } catch (error: any) {
      errorHandle(error);
    }
  }

  return {
    userInfo,
    unitList,
    systemUrls,
    access,
    routes,
    sideBarRouter,
    sysParameter,
    isIE,
    commonEnum,
  } as any;
}

export default {
  request: { ...(responseConfig as any), errorHandler: casErrorHandler },
  getInitialState,
} as const;
