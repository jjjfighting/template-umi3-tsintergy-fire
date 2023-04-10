import type { IShowType } from '../types';

export const getColumns = (showType?: IShowType, tabName?: string): any[] => {
  const daData = [
    {
      title: `${tabName ?? ''}-计划`,
      dataIndex: 'daData',
    },
  ];
  const rtData = [
    {
      title: `${tabName ?? ''}-实际`,
      dataIndex: 'rtData',
    },
  ];
  return [
    {
      title: '日期',
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
