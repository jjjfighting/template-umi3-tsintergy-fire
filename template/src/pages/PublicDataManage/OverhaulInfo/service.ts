import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataStruct } from './types';

/** 机组检修信息 */
export const getSdCapacity = (params: {
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/overhaul/capacity`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
