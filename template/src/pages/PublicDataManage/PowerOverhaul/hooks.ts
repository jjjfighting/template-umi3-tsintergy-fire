import useInitialState from '@/hooks/useInitialState';
import { YMD, YMDHms } from '@/utils/timeUtils';
import { cloneDeep, uniqueId } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useRequest, useSelector } from 'umi';
import { getTimeText } from '../config';
import { showTypeEnum } from './config';
import { getPowerOverhaul } from './service';
import type { IDataStruct1 } from './types';
import { Model } from './model';

// 请求数据处理
export const useRequestAid = () => {
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();
  const { runDates } = useSelector(Model.selector);
  const [showType, setShowType] = useState<string>(showTypeEnum[0].id);

  const {
    run,
    loading,
    data: resData,
  } = useRequest(getPowerOverhaul, {
    manual: true,
  });

  useEffect(() => {
    if (!runDates?.[0] || !runDates?.[1]) return;
    run({
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [run, runDates, systemProvinceAreaId]);

  const filtedData = useMemo(() => {
    const shadow = cloneDeep(resData);

    // 按照展示筛选数据
    return shadow
      ?.filter(({ dataItem }: { dataItem: string }) => showType === dataItem)
      ?.map((item: IDataStruct1, index: number) => {
        const { date, deviceName, deviceType, startTime, endTime } = item;

        return {
          ...item,
          order: index + 1,
          date: date?.split(' ')?.[0],
          startTime: moment(startTime).format(YMDHms),
          endTime: moment(endTime).format(YMDHms),
          key: uniqueId(`${date}_${deviceType}_${deviceName}_${startTime}_${endTime}`), // 唯一key
        };
      });
  }, [resData, showType]);

  const timeText = useMemo(() => {
    const shadow = cloneDeep(resData);
    const updateDate = runDates?.[1]?.format(YMD);

    // 查找更新时间，使用第一条计划数据的更新时间
    const firstDaData = shadow?.find(
      ({ date, dataItem }: { date: string; dataItem: string }) =>
        updateDate === date?.split(' ')[0] && showTypeEnum[0].id === dataItem,
    );

    return getTimeText(updateDate, firstDaData?.updateTime);
  }, [resData, runDates]);

  return [{ loading, filtedData, showType, timeText }, { setShowType }] as const;
};
