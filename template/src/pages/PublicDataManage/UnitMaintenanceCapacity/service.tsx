import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { request } from 'umi';
import type { IData } from '../types';

export const getStorageData = (data: {
  startDate: Moment;
  endDate: Moment;
}): Promise<AjaxRes<IData[]>> => {
  return request(`${API_PREFIX}/api/data/public/sd/common/data`, {
    method: 'post',
    data: {
      provinceAreaId: '037',
      daDataItemEnum: '741',
      startDate: data?.startDate?.format(YMD),
      endDate: data?.endDate?.format(YMD),
    },
  });
};

// export const getStorageData = (data: {
//   startDate: Moment;
//   endDate: Moment;
// }): Promise<AjaxRes<any>> => {
//   return request(`${API_PREFIX}/api/data/public/sd/common/data`, {
//     method: 'post',
//     data: {
//       provinceAreaId: '037',
//       daDataItemEnum: '007',
//       startDate: data?.startDate?.format(YMD),
//       endDate: data?.endDate?.format(YMD),
//     },
//   });
// };
