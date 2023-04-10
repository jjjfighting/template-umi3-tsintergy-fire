import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataSource } from './types';

/** 查询日前必开机组组合: http://yapi.devops.tsintergy.com/project/101094/interface/api/238792 */
export const getCombine = (params: { date: Moment }): PromiseRes<IDataSource[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/unit/combine`, {
    params: {
      date: params?.date?.format(YMD),
    },
  });
};
