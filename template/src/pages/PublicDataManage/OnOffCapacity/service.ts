import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IData } from '../types';

export const getStorageData = (
  data: {
    startDate: Moment;
    endDate: Moment;
  },
  daDataItemEnum: string,
): Promise<AjaxRes<IData[]>> => {
  return request(`${API_PREFIX}/api/data/public/sd/common/data`, {
    method: 'post',
    data: {
      daDataItemEnum,
      provinceAreaId: '037',
      startDate: data?.startDate?.format(YMD),
      endDate: data?.endDate?.format(YMD),
    },
  });
};
