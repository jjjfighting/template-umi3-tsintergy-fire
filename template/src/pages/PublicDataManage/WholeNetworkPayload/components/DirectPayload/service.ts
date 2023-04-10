import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IShowMode } from '../../types';
import type { IDataStruct } from './types';

// 直调负荷
export const getDirectLoad = (params: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/provincial/load`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
