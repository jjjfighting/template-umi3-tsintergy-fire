import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataStop } from './types';

/** 必开必停机组信息: http://yapi.devops.tsintergy.com/project/101094/interface/api/236986 */
export const getSdOpenStop = (params: {
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStop[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/openStop`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
