import { getLocalStorageTheme } from '@tsintergy/ppss';
import { useModel } from 'umi';
/**
 * 获取初始化数据
 */
interface SysParameter {
  systemCompanyOrgId: string;
  systemCompanyOrgName: string;
  systemProvinceId: string;
  systemProvinceName: string;
  systemProvinceAreaId: string;
  template: string; // 模板下载JSONString 格式
  loadDeclareBizId: string;
  loadLimitDeclareBizId: string;
  materialBizId: string;
  productRunInfoModule: string;
}

export default (): {
  userInfo: FIRE_BASE.PFUserInfoType;
  unitList: FIRE_BASE.Units[];
  access: any;
  routes: any;
  sideBarRouter: FIRE_BASE.resourceType[];
  systemUrls: FIRE_BASE.systemUrlsType;
  sysParameter: SysParameter;
  isIE: boolean;
  theme: ThemeType;
} => {
  const {
    initialState: {
      routes,
      userInfo,
      unitList,
      systemUrls,
      access,
      sideBarRouter,
      sysParameter,
      isIE,
    },
  } = useModel('@@initialState') as any;
  const theme: any = getLocalStorageTheme();
  return {
    userInfo,
    unitList,
    systemUrls,
    access,
    routes,
    sideBarRouter,
    sysParameter,
    isIE,
    theme: theme || 'light',
  };
};
