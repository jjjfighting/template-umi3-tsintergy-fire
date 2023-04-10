import { getGlobalCurrentDayMoment } from '@/utils/timeUtils';
import type { Moment } from 'moment';
import { createEvaModel } from 'umi';

export const Model = createEvaModel<{
  /** 业务要求切换页面时记录日期 */
  runDates: [Moment, Moment];
}>({
  state: {
    runDates: [
      getGlobalCurrentDayMoment().subtract(13, 'day'),
      getGlobalCurrentDayMoment().add(1, 'day'),
    ],
  },
});
