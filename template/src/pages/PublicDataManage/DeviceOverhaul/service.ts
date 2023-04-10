import { YMD } from '@tsintergy/ppss';
import { omit } from 'lodash';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataStruct } from './types';

// 输变电检修信息
export const getOverhaul = (params: {
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
  deviceName?: string;
}): PromiseRes<IDataStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/device/overhaul`, {
    params: {
      ...omit(params, ['dataPoint']),
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
