import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IShowMode } from '../types';
import type { IDataStruct } from './types';

export const getProvincePrice =
  (daDataItemEnum: '739', rtDataItemEnum: '740') =>
  (data: {
    /** 数据点个数 */
    dataPoint: IShowMode;
    /** 开始日期 */
    startDate: Moment;
    /** 结束日期 */
    endDate: Moment;
    /** 省区id */
    provinceAreaId: string;
  }): PromiseRes<IDataStruct[]> => {
    return request(`${API_PREFIX}/api/data/public/sd/common/public/data`, {
      method: 'post',
      data: {
        ...data,
        daDataItemEnum,
        rtDataItemEnum,
        startDate: data?.startDate?.format(YMD),
        endDate: data?.endDate?.format(YMD),
      },
    });
  };
