import type { IShowType } from '../../types';

export const getColumns = (showType?: IShowType): any[] => {
  const daData = [
    {
      title: '正备用-计划',
      dataIndex: 'daPosOrOpen',
    },
    {
      title: '负备用-计划',
      dataIndex: 'daNegOrStop',
    },
  ];
  const rtData = [
    {
      title: '正备用-实际',
      dataIndex: 'rtPosOrOpen',
    },
    {
      title: '负备用-实际',
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
