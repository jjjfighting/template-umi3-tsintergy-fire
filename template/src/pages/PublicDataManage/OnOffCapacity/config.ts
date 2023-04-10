import { tooltipLinkFormatter } from '@tsintergy/ppss';
import { rageTimesDate } from '@/utils/timeUtils';
import type { IData } from '../types';
import type { Moment } from 'moment';

export const getEchartsOptions = (
  runDates: [Moment, Moment],
  dataSource: Record<'openedData' | 'stopData', IData[]>,
) => {
  return {
    tooltip: {
      formatter: tooltipLinkFormatter,
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
    },
    xAxis: {
      type: 'category',
      data: rageTimesDate(runDates),
    },
    yAxis: {
      name: 'MW',
      type: 'value',
    },
    series: [
      {
        name: '必开容量-计划',
        type: 'bar',
        data: dataSource?.openedData?.map(({ daData }) => daData?.[0] ?? '-'),
      },
      {
        name: '必停容量-计划',
        type: 'bar',
        data: dataSource?.stopData?.map(({ daData }) => daData?.[0] ?? '-'),
      },
    ],
  } as echarts.EChartsOption;
};

export const getColumnsOptions = (runDates: [Moment, Moment]) => {
  return [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    ...rageTimesDate(runDates).map((item, index) => {
      return {
        title: item,
        dataIndex: index,
        key: index,
      };
    }),
  ];
};

export const getExportExcelColumns = () => [
  {
    title: '序号',
    dataIndex: 'order',
  },
  {
    title: '日期',
    dataIndex: 'date',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '必开机组',
    dataIndex: 'openUnit',
  },
  {
    title: '必停机组',
    dataIndex: 'stopUnit',
  },
];
