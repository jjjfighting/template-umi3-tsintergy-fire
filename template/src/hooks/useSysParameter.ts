import { useModel } from 'umi';

export interface SysParameter {
  systemCompanyOrgId: string;
  systemCompanyOrgName: string;
  systemProvinceId: string;
  systemProvinceName: string;
  systemProvinceAreaId: string;
  getMessageUrl: string;
  receiveMessageUrl: string;
  template: string; // 模板下载JSONString 格式
}

/**
 * 公共下拉选项
 */
export default (): SysParameter => {
  const {
    initialState: { sysParameter },
  }: any = useModel('@@initialState');
  return sysParameter || {};
};
