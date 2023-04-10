import type { ColumnsType } from 'antd/lib/table';

// 展示类型，id根据接口dataItem
export const showTypeEnum = [
  { name: '计划', id: '006' },
  { name: '执行情况', id: '720' },
];

export const getPowerColumns = (type: string) =>
  [
    {
      title: '序号',
      dataIndex: 'order',
      width: 60,
    },
    {
      title: type === showTypeEnum[0].id ? '机组名称' : '发电机组设备',
      dataIndex: 'deviceName',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 180,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 180,
    },
    {
      title: '检修类型',
      dataIndex: 'deviceType',
      render: (text: string) => text ?? '-',
    },
  ].map((item) => ({
    ...item,
  })) as ColumnsType;
