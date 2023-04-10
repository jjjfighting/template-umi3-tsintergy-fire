import { getGlobalCurrentDayMoment } from '@/utils/timeUtils';
import type { Moment } from 'moment';
import { createEvaModel } from 'umi';
import type { IMenuItem, IShowMode, IShowType } from './types';

export const publicModel = createEvaModel<{
  /** 两个日期 */
  runDate: Moment;
  runDates: [Moment, Moment];
  /** 数据展示类型 */
  showType?: IShowType;
  /** 数据展示维度 */
  showMode: IShowMode;
  /** 更新日期 */
  updateTime?: string | null;
  updateDate?: string;
  tabName: string | undefined;
  // 表头配置
  columns?: any[];
  // 图表数据合集
  dataSet: Partial<Record<string, (number | null)[]>>;
  allTicks?: string[];
  // 图表数据[表格, 下载]
  dataSourceOne?: any[];
  dataSourceAll?: any[];
  channelEnum: IMenuItem[];
}>({
  state: {
    runDate: getGlobalCurrentDayMoment().subtract(5, 'day'),
    runDates: [
      getGlobalCurrentDayMoment().subtract(5, 'day'),
      getGlobalCurrentDayMoment().add(1, 'day'),
    ],
    showMode: 'LEN_96',
    updateTime: null,
    tabName: undefined,
    columns: undefined,
    dataSet: {},
    channelEnum: [],
  },
});
