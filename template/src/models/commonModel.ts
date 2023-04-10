import { getGlobalCurrentDayMoment } from '@/utils/timeUtils';
import type { Moment } from 'moment';
import { createEvaModel } from 'umi';

/* 通用model */
interface CommomModel {
  // 切换主题标志
  themeChangeTag: number;
  // 运行日
  runDate: Moment;
}

export const commomModel = createEvaModel<CommomModel>({
  namespace: 'common-model',
  state: {
    themeChangeTag: 0,
    runDate: getGlobalCurrentDayMoment().add(1, 'days'),
  },
});
