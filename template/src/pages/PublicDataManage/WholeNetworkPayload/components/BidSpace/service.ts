import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IShowMode } from '../../types';
import type { IDataStruct } from './types';

/** 竞价空间: http://yapi.devops.tsintergy.com/project/101094/interface/api/236982 */
export const getBidSpace = (params: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/bid/space`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
