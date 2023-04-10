import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { ICommonStruct, IShowMode } from '../../types';

/** 新能源总加: http://yapi.devops.tsintergy.com/project/101094/interface/api/236996 */
export const getSdNewEnergy = (data: {
  /** 数据点个数 */
  dataPoint: IShowMode;
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<ICommonStruct[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/new/energy`, {
    method: 'post',
    data: {
      ...data,
      startDate: data?.startDate?.format(YMD),
      endDate: data?.endDate?.format(YMD),
    },
  });
};
