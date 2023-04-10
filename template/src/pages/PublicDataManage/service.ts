import { YMD } from '@/utils/timeUtils';
import type { Moment } from 'moment';
import { request } from 'umi';

// 新版通用公有数据查询
export const getSdCommonData =
  (daDataItemEnum?: string, rtDataItemEnum?: string) =>
  (data: {
    /** 数据点个数 */
    dataPoint: 'LEN_96' | 'LEN_24';
    /** 开始日期 */
    startDate: Moment;
    /** 结束日期 */
    endDate: Moment;
    /** 省区id */
    provinceAreaId: string;
  }) => {
    return request(`${API_PREFIX}/api/data/public/sd/common/data`, {
      method: 'post',
      data: {
        ...data,
        daDataItemEnum,
        rtDataItemEnum,
        startDate: data?.startDate?.format(YMD),
        endDate: data?.endDate?.format(YMD),
      },
    });
  };
