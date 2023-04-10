import useEnumHook from '@/hooks/useEnumHook';
import useInitialState from '@/hooks/useInitialState';
import { payloadMenuEnum } from '@/pages/PublicDataManage/config';
import { publicModel } from '@/pages/PublicDataManage/model';
import type { IMenuItem } from '@/pages/PublicDataManage/types';
import { rageTimesPoints, YMD } from '@tsintergy/ppss';
import { isEmpty, map } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useRequest, useSelector } from 'umi';
import { getSdOutgoing } from './service';

export const useOutgoingInfoReqAid = () => {
  const { dataLen } = useEnumHook();
  const { runDates, runDate, showMode, tabName } = useSelector(publicModel.selector);
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();

  // 联络线信息
  const { run: runBlock, data: channelData, loading } = useRequest(getSdOutgoing, { manual: true });
  useEffect(() => {
    runBlock({
      dataPoint: showMode,
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [runBlock, runDates, showMode, systemProvinceAreaId]);

  // 处理通道选择
  const channelEnum: IMenuItem[] = useMemo(() => {
    if (!tabName || !channelData) return [];
    return [...new Set(map(channelData, 'channelName'))]
      .filter((name) => name !== '总加')
      .map((key) => ({ label: key, value: key }));
  }, [channelData, tabName]);

  useEffect(() => {
    if (!channelEnum?.find(({ label }) => label === tabName)) {
      publicModel.actions.update({
        channelEnum,
      });
      if (!channelEnum?.length && !payloadMenuEnum?.find(({ label }) => label === tabName)) {
        publicModel.actions.update({
          tabName: payloadMenuEnum[3].label,
        });
      }
      return;
    }
    const resMap = new Map(
      map(channelData?.filter((item) => item.channelName === tabName) ?? [], (item) => [
        item.date?.split(' ')[0],
        item,
      ]),
    );

    const size = showMode === dataLen[0].id ? 96 : 24;
    const allTicks = rageTimesPoints(runDates, 'YYYY-MM-DD', size);
    const emptyData: null[] = Array(size).fill(null);
    let startDate = runDates?.[0]?.clone();
    const endDate = runDates?.[1];

    /** 日前 */
    const daData: (number | null)[] = [];
    /** 实时 */
    const rtData: (number | null)[] = [];

    // 处理日期匹配
    while (startDate && endDate && startDate?.isSameOrBefore(endDate)) {
      const tick = startDate?.format(YMD);
      const dataObj = resMap.get(tick);
      daData.push(
        ...(!isEmpty(dataObj?.dayAheadOutgoingEle ?? [])
          ? dataObj!?.dayAheadOutgoingEle
          : emptyData),
      );
      rtData.push(
        ...(!isEmpty(dataObj?.rtOutgoingEle ?? []) ? dataObj!?.rtOutgoingEle : emptyData),
      );
      startDate = startDate?.add(1, 'day');
    }

    // 更新时间
    const updateDay = resMap.get(runDates?.[1]?.format(YMD));

    publicModel.actions.update({
      updateTime: updateDay?.dayAheadUpdateTime,
      dataSet: {
        daData,
        rtData,
      },
      allTicks,
      channelEnum,
    });
  }, [channelData, tabName, runDate, runDates, showMode, dataLen, channelEnum]);

  return [{ channelEnum, loading }] as const;
};
