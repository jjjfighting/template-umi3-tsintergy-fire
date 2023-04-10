import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IDataSource } from './types';

/** 电网设备停运情况: http://yapi.devops.tsintergy.com/project/101094/interface/api/238792 */
export const getDeviceStop = (params: { date: Moment }): PromiseRes<IDataSource[]> => {
  return request(`${API_PREFIX}/api/data/public/sd/device/stop`, {
    params: {
      date: params?.date?.format(YMD),
    },
  });
};
