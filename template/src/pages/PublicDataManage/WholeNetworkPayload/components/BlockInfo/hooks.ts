import useEnumHook from '@/hooks/useEnumHook';
import useInitialState from '@/hooks/useInitialState';
import { rageTimesPoints } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import { isEmpty, map } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useRequest, useSelector } from 'umi';
import { publicModel } from '../../../model';
import { getSdBlock } from './service';

export const useReqAid = () => {
  const { dataLen } = useEnumHook();
  const { runDates, runDate, showMode } = useSelector(publicModel.selector);
  // 阻塞名
  const [blockName, setBlockName] = useState<string | undefined>(undefined);

  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();

  // 阻塞信息
  const { run: runBlock, data: blockData, loading } = useRequest(getSdBlock, {
    manual: true,
    onSuccess: (res) => {
      // 默认选中第一项
      setBlockName(res?.[0]?.blockName);
    },
  });

  useEffect(() => {
    runBlock({
      dataPoint: showMode,
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [runBlock, runDates, showMode, systemProvinceAreaId]);

  // 处理数据: 同时匹配日期
  const blockItem = useMemo(() => {
    // if (!blockName) return {};
    const size = showMode === dataLen[0].id ? 96 : 24;
    const ticks = rageTimesPoints(runDates, 'MM-DD', size);
    // 处理阻塞名过滤
    const blockEnum: Record<'id' | 'name', string>[] = [
      ...new Set(map(blockData, 'blockName')),
    ].map((key) => ({ id: key, name: key }));
    const dataMap = new Map(
      map(blockData?.filter((item) => item.blockName === blockName) ?? [], (item) => [
        item.date?.split(' ')[0],
        item,
      ]),
    );

    const emptyData: null[] = Array(size).fill(null);
    let startDate = runDates?.[0]?.clone();
    const endDate = runDates?.[1];

    /** 日前正向极限 */
    const daPosLimitArr: (number | null)[] = [];
    /** 日前反向极限 */
    const daNegLimitArr: (number | null)[] = [];
    /** 实时正向极限 */
    const rtPosLimitArr: (number | null)[] = [];
    /** 实时反向极限 */
    const rtNegLimitArr: (number | null)[] = [];

    /* 最新的更新日期 */
    let updateDate;
    let updateTime;

    // 处理日期匹配
    while (startDate && endDate && startDate?.isSameOrBefore(endDate)) {
      const tick = startDate?.format(YMD);
      const dataObj = dataMap.get(tick);

      // 有则覆盖，没则保留
      if (dataObj?.updateTime) {
        updateTime = dataObj?.updateTime;
        updateDate = tick;
      }

      daPosLimitArr.push(
        ...(!isEmpty(dataObj?.daPosLimit ?? []) ? dataObj!?.daPosLimit : emptyData),
      );
      daNegLimitArr.push(
        ...(!isEmpty(dataObj?.daNegLimit ?? []) ? dataObj!?.daNegLimit : emptyData),
      );
      rtPosLimitArr.push(
        ...(!isEmpty(dataObj?.rtPosLimit ?? []) ? dataObj!?.rtPosLimit : emptyData),
      );
      rtNegLimitArr.push(
        ...(!isEmpty(dataObj?.rtNegLimit ?? []) ? dataObj!?.rtNegLimit : emptyData),
      );
      startDate = startDate?.add(1, 'day');
    }

    // 处理下方单天数据
    const dataSource: (Record<
      'daPosLimit' | 'daNegLimit' | 'rtPosLimit' | 'rtNegLimit',
      number | null | undefined
    > & { tick: string })[] = [];
    const dataObj = dataMap.get(runDate?.format(YMD));

    // 距离
    const distance = runDate.diff(runDates?.[0], 'day') * size;

    const oneDayTick = ticks?.slice(distance, distance + size);
    oneDayTick.forEach((tick, index) => {
      dataSource.push({
        tick,
        daPosLimit: dataObj?.daPosLimit?.[index] ?? null,
        daNegLimit: dataObj?.daNegLimit?.[index] ?? null,
        rtPosLimit: dataObj?.rtPosLimit?.[index] ?? null,
        rtNegLimit: dataObj?.rtNegLimit?.[index] ?? null,
      });
    });

    return {
      ticks,
      dataSource,
      daPosLimitArr,
      daNegLimitArr,
      rtPosLimitArr,
      rtNegLimitArr,
      updateDate,
      updateTime,
      blockEnum,
    } as const;
  }, [blockData, blockName, dataLen, runDate, runDates, showMode]);

  useEffect(() => {
    publicModel?.actions.update({
      updateDate: blockItem?.updateDate,
      updateTime: blockItem?.updateTime,
    });
  }, [blockItem]);

  return [{ blockName, blockItem, loading }, { setBlockName }] as const;
};
