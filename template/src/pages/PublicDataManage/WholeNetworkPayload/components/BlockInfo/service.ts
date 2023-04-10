import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IShowMode } from '../../types';
import type { IDataBlock } from './types';

/** 阻塞信息: http://yapi.devops.tsintergy.com/project/101094/interface/api/236983 */
export const getSdBlock = (params: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataBlock[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/block`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
