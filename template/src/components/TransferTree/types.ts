import type { TransferProps } from 'antd/lib/transfer';
import type { MutableRefObject } from 'react';

export interface IUnitGroupData {
  createTime?: string; // 创建时间
  combinationName: string; // 组合名称
  id: string; // id
  orgIds: string[]; // ID列表
  updateTime?: string; // 最后一次修改时间
  sourceType?: string; // FIRE：火电，NEW_ENERGY：新能源
}

export interface IDataNode {
  key: string;
  title: string;
  children?: IDataNode[] | undefined;
}

export interface TransferTreeFace extends TransferProps<IDataNode> {
  mRef: MutableRefObject<{ showModal: (groupData: IUnitGroupData) => void } | null>;
  type: 'unit' | 'station'; // 机组或场站
  targetKeys: string[]; // 已选中的keys（右边穿梭框）
  loading?: boolean; // 是否加载
  onSearch?: () => void; // 点击查询按钮的回调
  onSave?: (params: any) => void; // 点击保存按钮的回调
  onDelete?: (id: string) => void; // 点击删除按钮的回调
}

export interface ICombinationData {
  createTime?: string; // 创建时间
  combinationName: string; // 机组组合名称
  id: string; // id
  orgIds: string[]; // 机组ID列表
  updateTime?: string; // 最后一次修改时间
  sourceType?: string; // FIRE：火电，NEW_ENERGY：新能源
}

export interface IUnitTreeItem {
  ownerId: string;
  ownerName: string;
  ownerShortName: string;
  unitId: string;
  unitName: string;
}

export interface IUnitTree {
  children: IUnitTreeItem[];
  ownerId: string;
  ownerName: string;
  ownerShortName: string;
}

// 分公司场站树
export interface ICompanyTree {
  orgId: string; // 组织id
  orgName: string; // 组织名称
  orgType: string; // 组织类型
  orgShortName: string; // 组织简称
  children: ICompanyTree[];
}

export interface IPriceDetailPoint {
  name: string; // 名称
  value: number; // 值
  isClearPrice?: boolean; // 是否为出清价格
}
