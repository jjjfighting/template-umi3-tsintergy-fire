import { request } from 'umi';
import type { Moment } from 'moment';
import { YMD } from '@/utils/timeUtils';

export interface IHolidayData {
  date: string;
  dayType: 1 | 2 | 3 | 4;
  weekdayType: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export const EnHoliday = ['工作日', '周六日', '周六日', '节假日'];

/* 节假日信息查询 */
export const getHolidayJudge = (params: {
  startDate: Moment;
  endDate: Moment;
}): Promise<AjaxRes<IHolidayData[]>> => {
  return request(`${API_PREFIX}/api/pps/base/holiday/judge`, {
    method: 'get',
    params: {
      startDate: params?.startDate?.format(YMD),
      endDate: params?.endDate?.format(YMD),
    },
  });
};
