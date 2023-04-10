/**
 * 有层级的拆分和复用
 * 权衡页面的复用和可维护
 * */
import useEnumHook from '@/hooks/useEnumHook';
import useInitialState from '@/hooks/useInitialState';
import { rageTimesPoints } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import { useMount, useUnmount } from 'ahooks';
import { assign, isEmpty, map } from 'lodash';
import { useEffect } from 'react';
import { useRequest, useSelector } from 'umi';
import { fieldMapping, getTimeText } from './config';
import { publicModel } from './model';
import type { IShowType } from './types';
import type { Moment } from 'moment';

// 对外暴露的初始化hook
export const useInitAid = (
  tabName: string,
  getColumns?: (showType?: IShowType, tabName?: string) => any[],
  request?: Function, // 请求函数
  fieldMappStr?: string, // 字段转换
) => {
  const { dataLen } = useEnumHook();
  const { showType, showMode, dataSet, allTicks, runDates, runDate, dataSourceOne } = useSelector(
    publicModel.selector,
  );

  // 初始化名称
  useMount(() => {
    publicModel.actions.update({
      tabName,
    });
  });

  // 离开时重置数据, 但是日期公用不重置, 不能用reset
  useUnmount(() => {
    publicModel.actions.update({
      showMode: dataLen[0].id as 'LEN_96',
      updateTime: null,
      // tabName: undefined,
      dataSourceOne: undefined,
      dataSourceAll: undefined,
      columns: [],
      dataSet: {},
    });
  });

  // 请求数据
  const [{ loading, resData }] = useRequestAid(request!);

  // 数据统一格式化
  useResFormat(resData, fieldMappStr);

  // 处理表格表头和数据
  useTableAid(getColumns);

  return [
    {
      loading,
      showType,
      allTicks,
      showMode,
      dataSet,
      runDates,
      runDate,
      dataSourceOne,
    },
  ];
};

// 请求数据处理
export const useRequestAid = (request: Function) => {
  const { runDates, showMode } = useSelector(publicModel.selector);
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();
  const {
    run,
    loading,
    data: resData,
  } = useRequest(request, {
    manual: true,
  });

  useEffect(() => {
    if (!runDates?.[0] || !runDates?.[1]) return;
    run({
      dataPoint: showMode,
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
    });
  }, [run, runDates, showMode, systemProvinceAreaId]);

  return [{ loading, resData }];
};

// 相应数据格式化处理和字段转换
export const useResFormat = (resData: any[], fieldMappStr?: string) => {
  const { dataLen } = useEnumHook();
  const { runDates, showMode, columns, tabName, channelEnum } = useSelector(publicModel.selector);
  useEffect(() => {
    if (!resData || !columns || channelEnum?.find(({ label }) => label === tabName)) return;

    /** 如果有需要字段转换 */
    const transformRes = fieldMappStr ? fieldMapping(...fieldMappStr.split(' '))(resData) : resData;
    /** 根据日期构成Map */
    const resMap = new Map(map(transformRes ?? [], (item) => [item?.date?.split(' ')[0], item]));
    /** 构成最终数据结构 */
    const keys = map(columns?.slice(1), 'dataIndex');
    const dataSetShadow = assign({}, ...map(keys, (key) => ({ [key]: [] })));
    /** 空数据 */
    const getEmptyData = (length?: 1 | 24 | 96): null[] =>
      Array(length || showMode === dataLen[0].id ? 96 : 24).fill(null);

    /* 最新的更新日期 */
    let updateDate;
    let updateTime;

    let startDate = runDates?.[0]?.clone();
    const endDate = runDates?.[1];
    /** 日期循环匹配 */
    while (startDate && endDate && startDate?.isSameOrBefore(endDate)) {
      const tick = startDate?.format(YMD);
      const dataObj: any = resMap.get(tick);

      // 有则覆盖，没则保留
      if (dataObj?.updateTime) {
        updateDate = tick;
        updateTime = dataObj?.updateTime;
      }
      /** 找到数据添加 */
      keys.forEach((key) => {
        const valArr = !isEmpty(dataObj?.[key] ?? []) ? dataObj!?.[key] : getEmptyData();
        dataSetShadow[key].push(...valArr);
      });
      startDate = startDate?.add(1, 'day');
    }

    /** 更新到Model */
    publicModel.actions.update({
      dataSet: dataSetShadow,
      updateDate,
      updateTime,
    });
  }, [columns, resData, runDates, showMode, fieldMappStr, dataLen, channelEnum, tabName]);
};

// 处理表格数据
export const useTableAid = (getColumns?: (showType?: IShowType, tabName?: string) => any[]) => {
  const { dataLen } = useEnumHook();
  const {
    runDates,
    runDate,
    showMode,
    showType,
    dataSet,
    columns,
    tabName,
    channelEnum,
    dataSourceAll,
  } = useSelector(publicModel.selector);

  // 动态获取表头配置
  useEffect(() => {
    if (!showType || !getColumns) return;
    publicModel.actions.update({
      columns: getColumns?.(showType, tabName),
    });
  }, [channelEnum, getColumns, showType, tabName]);

  /** 处理完整表格数据 */
  useEffect(() => {
    if (!columns) return;
    const size = showMode === dataLen?.[0]?.id ? 96 : 24;
    const allTicks = rageTimesPoints(runDates, 'YYYY-MM-DD', size);
    const keys = map((columns ?? [])?.slice(1), 'dataIndex');

    // 完整的数据(下载)
    const dataSourceShadow = (allTicks ?? [])?.map((wholeTick, index) => {
      const [date, tick] = wholeTick?.split(' ');
      return assign(
        {
          date,
          tick,
          wholeTick,
        },
        ...map(keys, (key) => ({ [key]: (dataSet as any)?.[key]?.[index] })),
      );
    });

    publicModel.actions.update({
      allTicks,
      dataSourceAll: dataSourceShadow,
    });
  }, [channelEnum, columns, dataLen, dataSet, runDate, runDates, showMode, tabName]);

  /** 单天的数据(表格) */
  useEffect(() => {
    if (!dataSourceAll?.length) return;
    const size = showMode === dataLen?.[0]?.id ? 96 : 24;
    // 单日在范围中的距离偏差
    const distance = runDate.diff(runDates?.[0], 'day') * size;
    /** 单天 */
    const dataSourceOne = dataSourceAll?.slice(distance, distance + size);
    publicModel.actions.update({
      dataSourceOne,
    });
  }, [channelEnum, dataLen, dataSourceAll, runDate, runDates, showMode, tabName]);
};

// 时间文本
export const useTimeTextAid = (tipsText?: string) => {
  const { updateDate, updateTime } = useSelector(publicModel.selector);
  return getTimeText(updateDate, updateTime, tipsText);
};

// 获取更新时间文本
export const useUpdateTimeAid = (
  resData: any[],
  runDates: [Moment, Moment],
  fieldMappStr?: string,
) => {
  if (!resData?.length) return `-日, 预测更新时间为:-`;

  /** 如果有需要字段转换 */
  const transformRes = fieldMappStr ? fieldMapping(...fieldMappStr.split(' '))(resData) : resData;
  /** 根据日期构成Map */
  const resMap = new Map(map(transformRes ?? [], (item) => [item?.date?.split(' ')[0], item]));

  /* 最新的更新日期 */
  let updateDate;
  let updateTime;

  let startDate = runDates?.[0]?.clone();
  const endDate = runDates?.[1];
  /** 日期循环匹配 */
  while (startDate && endDate && startDate?.isSameOrBefore(endDate)) {
    const tick = startDate?.format(YMD);
    const dataObj: any = resMap.get(tick);
    // 有则覆盖，没则保留
    if (dataObj?.updateTime) {
      updateDate = tick;
      updateTime = dataObj?.updateTime;
    }

    startDate = startDate?.add(1, 'day');
  }

  return `${updateDate ?? '-'}日, 预测更新时间为: ${updateTime ?? '-'}`;
};
