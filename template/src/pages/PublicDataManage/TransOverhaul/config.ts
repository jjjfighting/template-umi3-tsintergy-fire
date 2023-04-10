import type { ColumnsType } from 'antd/lib/table';

// 展示类型，id根据接口dataItem
export const showTypeEnum = [
  { name: '计划', id: '006' },
  { name: '执行情况', id: '720' },
];

// 输变电类型，id根据接口dataItem
export const dataTypeEnum = [
  { name: '变电设备检修计划执行情况', id: '734' },
  { name: '输电设备检修计划执行情况', id: '721' },
];

export const getTransColumns = (type: string) =>
  type === showTypeEnum[0].id
    ? ([
        {
          title: '序号',
          dataIndex: 'order',
          width: 60,
        },
        {
          title: '日期',
          dataIndex: 'date',
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName',
        },
        {
          title: '设备类型',
          dataIndex: 'deviceType',
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
      ].map((item) => ({
        ...item,
      })) as ColumnsType)
    : ([
        {
          title: '输电设备',
          dataIndex: 'deviceName',
        },
        {
          title: '电压等级（kV）',
          dataIndex: 'voltageLevel',
        },
        {
          title: '实际开工日期',
          dataIndex: 'startTime',
          width: 180,
        },
        {
          title: '实际完工日期',
          dataIndex: 'endTime',
          width: 180,
        },
        {
          title: '检修类型',
          dataIndex: 'deviceType',
        },
      ].map((item) => ({
        ...item,
      })) as ColumnsType);
