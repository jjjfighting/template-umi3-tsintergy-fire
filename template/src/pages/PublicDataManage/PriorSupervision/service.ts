import { YMD } from '@tsintergy/ppss';
import { request } from 'umi';
import type { IData } from './type';
import type { Moment } from 'moment';

export const getStorageData = (params: {
  startDate: Moment;
  endDate: Moment;
}): Promise<AjaxRes<IData[]>> => {
  return request(`${API_PREFIX}/api/data/public/sd/priorSuperviseInfo`, {
    method: 'get',
    params: {
      provinceAreaId: '037',
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
