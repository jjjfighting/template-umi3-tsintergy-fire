import useInitialState from '@/hooks/useInitialState';
import { getGlobalCurrentDayMoment, rageTimesDate } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import { isEmpty, map } from 'lodash';
import type { Moment } from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'umi';
import { getTimeText } from '../config';
import type { IShowType } from '../types';
import { getSdOpenStop } from './service';

export const useReqAid = () => {
  const [runDates, setRunDates] = useState<[Moment, Moment]>([
    getGlobalCurrentDayMoment().subtract(5, 'day'),
    getGlobalCurrentDayMoment().add(1, 'day'),
  ]);
  /** 数据展示类型 */
  const [showType, setShowType] = useState<IShowType>('all');

  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();

  // 请求备用信息
  const {
    run: runBackup,
    data: backupData,
    loading,
  } = useRequest(getSdOpenStop, {
    manual: true,
  });

  useEffect(() => {
    runBackup({
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [runBackup, runDates, systemProvinceAreaId]);

  // 处理数据: 同时匹配日期
  const stopDataItem = useMemo(() => {
    const ticks = rageTimesDate(runDates);
    const dataMap = new Map(map(backupData ?? [], (item) => [item.date?.split(' ')[0], item]));
    const emptyData: null[] = Array(1).fill(null);
    let startDate = runDates?.[0]?.clone();
    const endDate = runDates?.[1];
    /** 日前正或必开数据 */
    const daPosOrOpenArr: (number | null)[] = [];
    /** 日前负或必停数据 */
    const daNegOrStopArr: (number | null)[] = [];
    /** 实时正或必开数据 */
    const rtPosOrOpenArr: (number | null)[] = [];
    /** 实时负或必停数据 */
    const rtNegOrStopArr: (number | null)[] = [];

    // 处理下方单天数据
    const dataSource: (Record<
      'daPosOrOpen' | 'daNegOrStop' | 'rtPosOrOpen' | 'rtNegOrStop',
      number | null | undefined
    > & { tick: string })[] = [];

    /* 最新的更新日期 */
    let updateDate;
    let updateTime;

    // 处理日期匹配
    while (startDate && endDate && startDate?.isSameOrBefore(endDate)) {
      const tick = startDate?.format(YMD);
      const dataObj = dataMap.get(tick);

      // 有则覆盖，没则保留
      if (dataObj?.updateTime) {
        updateDate = tick;
        updateTime = dataObj?.updateTime;
      }

      daPosOrOpenArr.push(
        ...(!isEmpty(dataObj?.daPosOrOpen ?? []) ? dataObj!?.daPosOrOpen : emptyData),
      );
      daNegOrStopArr.push(
        ...(!isEmpty(dataObj?.daNegOrStop ?? []) ? dataObj!?.daNegOrStop : emptyData),
      );
      rtPosOrOpenArr.push(
        ...(!isEmpty(dataObj?.rtPosOrOpen ?? []) ? dataObj!?.rtPosOrOpen : emptyData),
      );
      rtNegOrStopArr.push(
        ...(!isEmpty(dataObj?.rtNegOrStop ?? []) ? dataObj!?.rtNegOrStop : emptyData),
      );

      dataSource.push({
        tick,
        daPosOrOpen: daPosOrOpenArr[daPosOrOpenArr?.length - 1],
        daNegOrStop: daNegOrStopArr[daNegOrStopArr?.length - 1],
        rtPosOrOpen: rtPosOrOpenArr[rtPosOrOpenArr?.length - 1],
        rtNegOrStop: rtNegOrStopArr[rtNegOrStopArr?.length - 1],
      });

      startDate = startDate?.add(1, 'day');
    }

    return {
      ticks,
      dataSource,
      daPosOrOpenArr,
      daNegOrStopArr,
      rtPosOrOpenArr,
      rtNegOrStopArr,
      timeText: getTimeText(updateDate, updateTime),
    } as const;
  }, [backupData, runDates]);

  return [
    { runDates, showType, stopDataItem, loading },
    { setRunDates, setShowType },
  ] as const;
};
