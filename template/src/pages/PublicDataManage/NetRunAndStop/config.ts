export const getColumns = (): any[] => {
  return [
    {
      title: '序号',
      dataIndex: 'order',
      width: 60,
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
    },
    {
      title: '停电设备',
      dataIndex: 'deviceName',
    },
    {
      title: '电压等级',
      dataIndex: 'voltage',
    },
    {
      title: '影响发电设备',
      dataIndex: 'influenceDevice',
      width: 200,
    },
    {
      title: '停役时间',
      dataIndex: 'stopTime',
    },
    {
      title: '计划送电时间',
      dataIndex: 'planTime',
    },
  ].map((item) => ({ align: 'left', width: 120, ...item }));
};
