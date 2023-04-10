import type { IShowType } from '../types';

export const getColumns = (showType?: IShowType, tabName?: string): any[] => {
  const daData = [
    {
      title: `${tabName ?? ''}-日前`,
      dataIndex: 'daData',
    },
  ];
  const rtData = [
    {
      title: `${tabName ?? ''}-实时`,
      dataIndex: 'rtData',
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
