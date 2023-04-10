import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataStruct1 } from './types';

/**
 * 发电检修信息
 * yapi：http://yapi.devops.tsintergy.com/project/101094/interface/api/243135
 */
export const getPowerOverhaul = (params: {
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStruct1[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/overhaulUnit`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
