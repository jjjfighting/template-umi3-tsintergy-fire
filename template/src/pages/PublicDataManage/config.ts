import { max } from 'lodash';
import { exportExcel } from '@/utils/excelUtils';
import type { ICommonStruct, IMenuList, IShowType } from './types';
import type { Moment } from 'moment';
import { YMD } from '@tsintergy/ppss';

// 展示类型
export const showTypeEnum = [
  { label: '全部', value: 'all' },
  { label: '计划', value: '1' },
  { label: '实际', value: '2' },
];

// 展示类型-全省节点电价
export const showTypeEnum_province = [
  { label: '全部', value: 'all' },
  { label: '日前', value: '1' },
  { label: '实时', value: '2' },
];

// 获取顶部日期字符串
export const getTimeText = (
  updateDate?: string,
  updateTime?: string | null,
  tipsText?: string | null,
) => `${updateDate ?? '-'}日, ${tipsText ?? '计划'}披露数据更新时间为: ${updateTime ?? '-'}`;

// 请求返回的数据字段转换器, 输出统一的格式
// 标准字段[ICommonStruct]: date updateTime daData rtData
export const fieldMapping = (
  timeKey: string = 'updateTime',
  daKey: string = 'daData',
  rtKey: string = 'rtData',
) => (list: any[] | undefined) => {
  return list?.map((item) => ({
    date: item?.date,
    updateTime: item?.[timeKey],
    daData: item?.[daKey],
    rtData: item?.[rtKey],
  })) as ICommonStruct[];
};

// 公共的表头配置
export const getCommonColumns = (showType?: IShowType, tabName?: string): any[] => {
  const daData = [
    {
      title: `${tabName ?? ''}-计划`,
      dataIndex: 'daData',
      render: (num: number) => num?.toFixed(2) ?? '-',
    },
  ];
  const rtData = [
    {
      title: `${tabName ?? ''}-实际`,
      dataIndex: 'rtData',
      render: (num: number) => num?.toFixed(2) ?? '-',
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

// export const fillSeriesData = (item: any, field: string) =>
//   Array.isArray(item[field]) && item[field].length === 0
//     ? Array(item.tvMeta.size).fill(null)
//     : item[field];

// 列相减 "求偏差值"
export const colSubrtact = (
  rtData: (number | null)[] = [],
  daData: (number | null)[] = [],
  len = 2,
): (number | null)[] => {
  const maxLength = max([rtData?.length ?? 0, daData?.length ?? 0]);
  return Array(maxLength)
    .fill(null)
    .map((n, index) => {
      const rtNum = rtData?.[index];
      const daNum = daData?.[index];
      if (typeof rtNum === 'number' && typeof daNum === 'number') {
        return Number((rtNum - daNum).toFixed(len));
      }
      return n;
    });
};

export const dataSourceWithOrder = (dataSource?: any[]): any[] => {
  return (dataSource ?? [])?.map((item, index) => ({ order: index + 1, ...item }));
};

// 当前机组/场站属于当前用户企业时，排在前面
export const sortByTenantName = (data: any[] | undefined, tenantName: string | undefined) => {
  return data?.sort((a: any, b: any) => (a?.osName === tenantName ? -1 : 0)) ?? [];
};

// 导出Excel
export const excelAid = (
  runDates: [Moment, Moment],
  tabName: string | undefined,
  columns: any[] | undefined,
  dataSourceAll: any[] | undefined,
) => {
  // 返回下载函数
  return () => {
    if (!tabName || !runDates?.[0] || !runDates?.[1]) return;

    exportExcel({
      columnConfig: [
        {
          title: '日期',
          dataIndex: 'date',
        },
        {
          title: '时间',
          dataIndex: 'tick',
        },
        ...(columns ?? [])?.slice(1),
      ],
      data: dataSourceAll ?? [],
      filename: `${tabName ?? '-'}(${runDates?.[0]?.format(YMD) ?? '-'}至${
        runDates?.[1]?.format(YMD) ?? '-'
      })`,
      tableHeaderNumber: 0,
      nullPlaceholder: '',
    });
  };
};

// 全网负荷信息菜单枚举
export const payloadMenuEnum: IMenuList = [
  { label: '竞价空间', value: 'BidSpace' },
  { label: '直调负荷', value: 'DirectPayload' },
  { label: '全网负荷', value: 'NetworkLoad' },
  { label: '联络线受电负荷', value: 'ElePayload' },
  { label: '新能源总加', value: 'NewEnergySum' },
  { label: '风电总加', value: 'WindSum' },
  { label: '光伏总加', value: 'LightSum' },
  { label: '核电总加', value: 'NuclearSum' },
  { label: '试验机组总加', value: 'TestUnitSum' },
  { label: '自备机组总加', value: 'SpareUnitSum' },
  { label: '地方电厂发电总加', value: 'LocalPowerSum' },
  { label: '抽蓄', value: 'StorageSum' },
  { label: '备用信息', value: 'BackUpInfo' },
  { label: '阻塞信息', value: 'BlockInfo' },
];
