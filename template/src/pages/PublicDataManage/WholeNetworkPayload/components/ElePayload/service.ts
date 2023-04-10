import type { IOutgoingStruct } from './types';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IShowMode } from '../../types';
import { YMD } from '@tsintergy/ppss';

/** 联络线信息 */
export const getSdOutgoing = (params: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IOutgoingStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/outgoing`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
