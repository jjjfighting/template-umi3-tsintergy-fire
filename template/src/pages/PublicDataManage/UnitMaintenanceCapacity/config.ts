import { tooltipLinkFormatter } from '@tsintergy/ppss';
import { rageTimesDate } from '@/utils/timeUtils';
import type { Moment } from 'moment';
import type { IData } from '../types';

export const getEchartsOptions = (runDates: [Moment, Moment], dataSource: IData[]) => {
  if (!dataSource?.length) return {};

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
        name: '机组检修容量-计划',
        type: 'bar',
        data: dataSource.map(({ daData }) => daData?.[0] ?? '-'),
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
    title: '预测总容量（MW）',
    dataIndex: 'value',
  },
];
