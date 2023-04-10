import useInitialState from '@/hooks/useInitialState';
import { rageTimesDate } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import { map } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useRequest, useSelector } from 'umi';
import { getTimeText } from '../config';
import { publicModel } from '../model';
import { getSdCapacity } from './service';

export const useReqAid = () => {
  const { runDates } = useSelector(publicModel.selector);
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();

  // 请求机组检修信息
  const {
    run: runCapacity,
    data: capacityData,
    loading,
  } = useRequest(getSdCapacity, {
    manual: true,
  });

  useEffect(() => {
    runCapacity({
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [runCapacity, runDates, systemProvinceAreaId]);

  // 处理数据
  const capacityItem = useMemo(() => {
    const ticks = rageTimesDate(runDates);
    const dataMap = new Map(map(capacityData ?? [], (item) => [item.date?.split(' ')[0], item]));
    let startDate = runDates?.[0]?.clone();
    const endDate = runDates?.[1];

    // 日前
    const daData: (number | null)[] = [];
    // 实时
    const rtData: (number | null)[] = [];
    // 表格和下载表格数据相同
    const dataSource: any[] = [];

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

      daData.push((dataObj?.dayAheadCapacity ?? [null])?.[0]);
      rtData.push((dataObj?.rtCapacity ?? [null])?.[0]);
      dataSource.push({
        tick,
        daData: (dataObj?.dayAheadCapacity ?? [null])?.[0],
        rtData: (dataObj?.rtCapacity ?? [null])?.[0],
      });

      startDate = startDate?.add(1, 'day');
    }

    return {
      dataSource,
      ticks,
      daData,
      rtData,
      timeText: getTimeText(updateDate, updateTime),
    } as const;
  }, [capacityData, runDates]);

  return [{ capacityItem, loading }] as const;
};
