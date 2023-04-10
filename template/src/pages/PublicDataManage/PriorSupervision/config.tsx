export const getColumnsOptions = () => {
  return [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      render: (_: any, __: any, index: number) => `${index + 1}`,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => date.split(' ')[0],
    },
    {
      title: '事前监管信息',
      dataIndex: 'info',
      key: 'info',
      render: (info: '0' | '1') =>
        info === '1' ? (
          <span style={{ color: 'var(--danger-color)' }}>触发事前监管</span>
        ) : (
          '未触发事前监管'
        ),
    },
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
    title: '事前监管信息',
    dataIndex: 'info',
  },
];
