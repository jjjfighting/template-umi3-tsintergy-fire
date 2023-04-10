/* 初始数据的类型 */
import type { CommonEnum } from '../hooks/useEnumHook';

export type InitStateType = {
  userInfo: FIRE_BASE.PFUserInfoType;
  systemUrls: FIRE_BASE.systemUrlsType;
  access: any;
  routes: any;
  sideBarRouter: FIRE_BASE.resourceType[];
  sysParameter: any;
  isIE: boolean;
  commonEnum: CommonEnum;
};
