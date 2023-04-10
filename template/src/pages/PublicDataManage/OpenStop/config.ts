import type { IShowType } from '../types';

export const getColumns = (showType: IShowType): any[] => {
  const daData = [
    {
      title: '必开机组总容量-计划',
      dataIndex: 'daPosOrOpen',
    },
    {
      title: '必停机组总容量-计划',
      dataIndex: 'daNegOrStop',
    },
  ];
  const rtData = [
    {
      title: '必开机组总容量-实际',
      dataIndex: 'rtPosOrOpen',
    },
    {
      title: '必停机组总容量-实际',
      dataIndex: 'rtNegOrStop',
    },
  ];
  return [
    {
      title: '数据类型',
      dataIndex: 'tick',
      align: 'left',
    },
    ...(showType === 'all' ? [...daData, ...rtData] : []),
    ...(showType === '1' ? daData : []),
    ...(showType === '2' ? rtData : []),
  ].map((item) => ({
    width: 120,
    align: 'right',
    render: (text: number | string) => text ?? '-',
    ...item,
  }));
};

// 处理下载数据
export const getExcelDataSource = (
  ticks: string[],
  daPosOrOpenArr: (number | null)[],
  daNegOrStopArr: (number | null)[],
  rtPosOrOpenArr: (number | null)[],
  rtNegOrStopArr: (number | null)[],
): any[] => {
  return (ticks ?? []).map((tick, index) => ({
    tick,
    daPosOrOpen: daPosOrOpenArr?.[index] ?? null,
    daNegOrStop: daNegOrStopArr?.[index] ?? null,
    rtPosOrOpen: rtPosOrOpenArr?.[index] ?? null,
    rtNegOrStop: rtNegOrStopArr?.[index] ?? null,
  }));
};
