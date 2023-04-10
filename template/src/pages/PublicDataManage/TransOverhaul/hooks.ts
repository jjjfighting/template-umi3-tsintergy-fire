import useInitialState from '@/hooks/useInitialState';
import { getGlobalCurrentDayMoment, YMD, YMDHms } from '@/utils/timeUtils';
import { cloneDeep, uniqueId } from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useRequest, useSelector } from 'umi';
import { getTimeText } from '../config';
import { showTypeEnum } from './config';
import { getTransOverhaul } from './service';
import type { IDataStruct1 } from './types';
import { Model } from './model';

// 请求数据处理
export const useRequestAid = (dataType?: string | null) => {
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();
  const { runDates } = useSelector(Model.selector);
  const [showType, setShowType] = useState<string>(showTypeEnum[0].id);

  const {
    run,
    loading,
    data: resData,
  } = useRequest(getTransOverhaul, {
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
    const ds =
      showType === showTypeEnum?.[0]?.id
        ? shadow?.overhaulPlanDTOList
        : shadow?.sdPublishOverhaulPlanDTOList;

    // 按照展示筛选数据
    return ds
      ?.filter(({ dataItem }: { dataItem: string }) => {
        return dataType ? dataType === dataItem : true;
      })
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
  }, [resData, showType, dataType]);

  const timeText = useMemo(() => {
    const updateDate = runDates?.[1]?.format(YMD);
    const ds = cloneDeep(resData)?.overhaulPlanDTOList;

    // 查找更新时间，使用第一条计划数据的更新时间
    const firstDaData = ds?.find(
      ({ date, dataItem }: { date: string; dataItem: string }) =>
        (dataType ? dataType === dataItem : true) && updateDate === date?.split(' ')[0],
    );

    return getTimeText(updateDate, firstDaData?.updateTime);
  }, [dataType, resData, runDates]);

  return [{ loading, filtedData, showType, timeText }, { setShowType }] as const;
};
