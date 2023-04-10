export const getColumns = () => {
  return [
    {
      title: '序号',
      dataIndex: 'order',
      width: 60,
    },
    {
      title: '电厂名称',
      dataIndex: 'osName',
    },
    {
      title: '机组台数',
      dataIndex: 'unitNumber',
    },
    {
      title: '电压等级(kV)',
      dataIndex: 'voltage',
    },
    {
      title: '原因',
      dataIndex: 'reason',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
    },
  ];
};
