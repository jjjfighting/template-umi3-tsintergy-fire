import { merge } from 'lodash';
import type { ICombinationData, ICompanyTree, IUnitGroupData, IUnitTree } from './types';

// 获取场站ids
export const getOrgIds = (data: any[]) => {
  const result = data.reduce((acc, item) => {
    return [...acc, ...(item?.children ?? [])];
  }, []);
  return result ?? [];
};

/**
 * 场站组合转换成树形数据
 * @param orignData 转换前数据
 * @returns IDataNode[]
 */
export const formatTreeStation = (
  unitTree: ICompanyTree[],
  stationGroupData: ICombinationData,
  orgOsCleanMap: OSCleanMap | OrgMap,
) => {
  // 所有场站
  const stationList = unitTree.reduce(
    (
      acc: {
        osOrgId: string;
        osOrgName: string;
        ownerName: string;
        ownerId: string;
      }[],
      item,
    ) => {
      const stations = item.children.map((sItem) => ({
        osOrgId: sItem.orgId, // 场站id
        osOrgName: orgOsCleanMap?.get(sItem.orgId)?.mergeName ?? '', // 场站名
        ownerName: item.orgName, // 分公司名
        ownerId: item.orgId, // 分公司id
      }));
      return [...acc, ...stations];
    },
    [],
  );

  // 树节点
  const treeList: OsCompanyTreeList[] = [];

  stationGroupData?.orgIds?.forEach((osOrgId) => {
    const temp = stationList.find((v) => v.osOrgId === osOrgId);
    if (!temp) return;
    // 是否存在
    const existIndex = treeList.findIndex((item) => item.key === temp?.ownerId);

    if (existIndex > -1) {
      // 存在-覆盖
      treeList[existIndex] = merge(treeList[existIndex], {
        children: [
          ...(treeList[existIndex]?.children ?? []),
          {
            title: temp?.osOrgName,
            key: temp?.osOrgId,
          },
        ],
      });
    } else {
      // 否则追加新的树节点
      treeList.push({
        title: temp?.ownerName,
        key: temp?.ownerId,
        value: temp?.osOrgId,
        children: [
          {
            title: temp?.osOrgName,
            key: temp?.osOrgId,
            value: temp?.osOrgId,
          },
        ],
      });
    }
  });

  return treeList;
};

/**
 * 机组组合转换成树形数据
 * @param orignData 转换前数据
 * @returns IDataNode[]
 */

export const formatTreeUnit = (unitTree: IUnitTree[], unitGroupData: IUnitGroupData) => {
  // 所有机组
  const unitList = unitTree.reduce(
    (
      acc: {
        unitId: string;
        unitName: string;
        ownerName: string;
        ownerShortName: string;
        ownerId: string;
      }[],
      item,
    ) => {
      const units = item.children.map((sItem) => ({
        unitId: sItem.unitId,
        unitName: sItem.unitName,
        ownerName: sItem.ownerName,
        ownerShortName: sItem.ownerShortName,
        ownerId: sItem.ownerId,
      }));
      return [...acc, ...units];
    },
    [],
  );

  // 树节点
  const treeList: OsCompanyTreeList[] = [];

  unitGroupData?.orgIds?.forEach((unitId) => {
    const temp = unitList.find((v) => v.unitId === unitId);
    if (!temp) return;
    // 是否存在
    const existIndex = treeList.findIndex((item) => item.key === temp?.ownerId);

    if (existIndex > -1) {
      // 存在-覆盖
      treeList[existIndex] = merge(treeList[existIndex], {
        children: [
          ...(treeList[existIndex]?.children ?? []),
          {
            title: temp?.unitName,
            key: temp?.unitId,
          },
        ],
      });
    } else {
      // 否则追加新的树节点
      treeList.push({
        title: temp?.ownerShortName || temp?.ownerName,
        key: temp?.ownerId,
        value: temp?.ownerId,
        children: [
          {
            title: temp?.unitName,
            key: temp?.unitId,
            value: temp?.unitId,
          },
        ],
      });
    }
  });

  return treeList;
};
