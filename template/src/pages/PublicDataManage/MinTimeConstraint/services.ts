import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataSource } from './types';

/** 查询日前开机不满最小约束时间机组名单: http://yapi.devops.tsintergy.com/project/101094/interface/api/238792 */
export const getDissatisfaction = (params: { date: Moment }): PromiseRes<IDataSource[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/unit/dissatisfaction`, {
    params: {
      date: params?.date?.format(YMD),
    },
  });
};
