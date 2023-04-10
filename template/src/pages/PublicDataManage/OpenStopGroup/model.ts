import type { Moment } from 'moment';
import moment from 'moment';
import { createEvaModel } from 'umi';

export const Model = createEvaModel<{
  /** 业务要求切换页面时记录日期 */
  runDate: Moment;
}>({
  state: {
    runDate: moment(),
  },
});
