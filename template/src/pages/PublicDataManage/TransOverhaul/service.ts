import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataStruct2 } from './types';

/**
 * 输变电检修信息
 * yapi：http://yapi.devops.tsintergy.com/project/101094/interface/api/243134
 */
export const getTransOverhaul = (params: {
  /** 开始日期 */
  startDate: Moment;
  /** 结束日期 */
  endDate: Moment;
  /** 省区id */
  provinceAreaId: string;
}): PromiseRes<IDataStruct2> => {
  return request(`${API_PREFIX}/api/data/public/sd/overhaulTrans`, {
    params: {
      ...params,
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
