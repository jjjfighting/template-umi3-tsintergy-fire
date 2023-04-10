import type { IShowType } from '../../types';

export const getColumns = (showType?: IShowType): any[] => {
  const daData = [
    {
      title: '正向极限-计划',
      dataIndex: 'daPosLimit',
    },
    {
      title: '负向极限-计划',
      dataIndex: 'daNegLimit',
    },
  ];
  const rtData = [
    {
      title: '正向极限-实际',
      dataIndex: 'rtPosLimit',
    },
    {
      title: '负向极限-实际',
      dataIndex: 'rtNegLimit',
    },
  ];
  return [
    {
      title: '数据类型',
      dataIndex: 'tick',
      align: 'left',
      render: (text: string) => text?.split(' ')?.[1] ?? '',
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
