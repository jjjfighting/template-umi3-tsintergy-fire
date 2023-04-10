import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { ICommonStruct, IShowMode } from '../../types';

export const getStorageData = (daDataItemEnum: '735', rtDataItemEnum: '736') => (data: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<ICommonStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/common/data`, {
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
