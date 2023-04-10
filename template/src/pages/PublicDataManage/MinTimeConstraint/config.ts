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
      title: '机组名称',
      dataIndex: 'unitName',
    },

    {
      title: '约束开始日期',
      dataIndex: 'startTime',
    },
    {
      title: '约束结束日期',
      dataIndex: 'endTime',
    },
  ];
};
