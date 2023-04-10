import useInitialState from '@/hooks/useInitialState';
import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useRequest } from 'umi';
import { formatTreeStation, formatTreeUnit, getOrgIds } from './helper';
import {
  deleteStationsGroup,
  deleteUnitsGroup,
  getStationsGroup,
  getUnitsGroup,
  getUnitTree,
  saveStationsGroup,
  saveUnitsGroup,
} from './service';
import type { ICombinationData, ICompanyTree, IDataNode, IUnitTreeItem } from './types';

export const templateVal = 'templateId';

// 场站处理(新能源)
export const useCleanOrgAid = () => {
  const { orgOsCompanyList } = useInitialState();
  // 所有场站id
  const allOrgIds = useMemo(() => {
    if (!orgOsCompanyList) return [];
    return getOrgIds(orgOsCompanyList)?.map((item: Omit<ICompanyTree, 'children'>) => item.orgId);
  }, [orgOsCompanyList]);

  return { allOrgIds } as const;
};

// 组合处理(新能源)
export const useCleanCombinationAid = (groupId: string) => {
  const { orgOsCompanyList, orgOsCleanMap, orgOsTreeList } = useInitialState();
  const { allOrgIds } = useCleanOrgAid();
  const [stationGroupList, setStationGroupList] = useState<ICombinationData[]>();
  // 查询场站组合列表
  const { loading: getStationsGroupLoading, refresh: getStationsGroupRefresh } = useRequest(
    getStationsGroup,
    {
      onSuccess: (res) => {
        // 保存已自定义查询的信息
        const templateList = stationGroupList?.filter((item) => item.id === templateVal) ?? [];
        const tempStationGroupList = [...res, ...templateList];
        setStationGroupList(tempStationGroupList);
      },
    },
  );

  // 保存机组组合列表
  const { run: saveStationsGroupRun, loading: saveLoading } = useRequest(saveStationsGroup, {
    manual: true,
    onSuccess: () => {
      getStationsGroupRefresh();
    },
  });

  // 删除机组组合列表
  const { run: deleteStationsGroupRun, loading: delLoading } = useRequest(deleteStationsGroup, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      getStationsGroupRefresh();
    },
  });

  // 处理穿梭框查询回调
  const onSearch = (targetKeys: string[]) => {
    if (!targetKeys?.length) return;
    const tempIndex = stationGroupList?.findIndex((item) => item.id === templateVal) ?? -1;
    const tempList = [...(stationGroupList ?? [])];
    // 已经存在临时组合替换。否则追加
    if (tempIndex > -1) {
      tempList.splice(tempIndex, 1, {
        combinationName: '自定义查询组合',
        id: templateVal,
        orgIds: targetKeys,
      });
    } else {
      tempList.push({
        combinationName: '自定义查询组合',
        id: templateVal,
        orgIds: targetKeys,
      });
    }

    setStationGroupList?.(tempList);
  };

  // 根据选中组合获取树形数据
  const selectedTreeData = useMemo(() => {
    if (!orgOsCompanyList || !orgOsCompanyList.length) return [];
    const result = stationGroupList?.find((item) => item.id === groupId);
    return result ? formatTreeStation(orgOsCompanyList, result, orgOsCleanMap) : orgOsTreeList;
  }, [groupId, orgOsCleanMap, orgOsCompanyList, orgOsTreeList, stationGroupList]);

  // 当前选中组合包含的orgids
  const selectedOrgIds = useMemo(() => {
    const result = stationGroupList?.find((item) => item.id === groupId);
    return result?.orgIds?.filter((item) => allOrgIds?.includes(item)) ?? allOrgIds;
  }, [allOrgIds, groupId, stationGroupList]);

  return [
    {
      stationGroupList,
      selectedTreeData,
      selectedOrgIds,
      loading: delLoading || saveLoading || getStationsGroupLoading,
    },
    {
      setStationGroupList,
      deleteStationsGroupRun,
      saveStationsGroupRun,
      onSearch,
    },
  ];
};

// 机组处理(火电)
export const useFireOrgAid = () => {
  // 获取场站树（所有）
  const { data: orgOsCompanyList } = useRequest(getUnitTree);

  // 所有场站id
  const allOrgIds = useMemo(() => {
    if (!orgOsCompanyList) return [];
    return getOrgIds(orgOsCompanyList)?.map((item: IUnitTreeItem) => item.unitId);
  }, [orgOsCompanyList]);

  const orgOsTreeList = useMemo(() => {
    return orgOsCompanyList?.reduce((acc: IDataNode[], item) => {
      const result = {
        // 有简称优先显示简称
        title: item.ownerShortName || item.ownerName,
        key: item.ownerId,
        children: item.children.map((sItem) => ({
          title: sItem.unitName,
          key: sItem.unitId,
        })),
      };
      return [...acc, result];
    }, []);
  }, [orgOsCompanyList]);

  return { allOrgIds, orgOsCompanyList, orgOsTreeList } as const;
};

// 组合处理(火电)
export const useFireCombinationAid = (groupId: string) => {
  const { allOrgIds, orgOsCompanyList, orgOsTreeList } = useFireOrgAid();
  const [unitGroupList, setUnitGroupList] = useState<ICombinationData[]>();

  // 查询机组组合列表
  const { loading: getUnitsGroupLoading, refresh: getUnitsGroupRefresh } = useRequest(
    getUnitsGroup,
    {
      onSuccess: (res) => {
        // 保存已自定义查询的信息
        const templateList = unitGroupList?.filter((item) => item.id === templateVal) ?? [];
        const tempUnitGroupList = [...res, ...templateList];
        setUnitGroupList(tempUnitGroupList);
      },
    },
  );

  // 保存机组组合列表
  const { run: saveUnitsGroupRun, loading: saveLoading } = useRequest(saveUnitsGroup, {
    manual: true,
    onSuccess: () => {
      getUnitsGroupRefresh();
    },
  });

  // 删除机组组合列表
  const { run: deleteUnitsGroupRun, loading: delLoading } = useRequest(deleteUnitsGroup, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      getUnitsGroupRefresh();
    },
  });

  // 处理穿梭框查询回调
  const onSearch = (targetKeys: string[]) => {
    if (!targetKeys?.length) return;
    const tempIndex = unitGroupList?.findIndex((item) => item.id === templateVal) ?? -1;
    const tempList = [...(unitGroupList ?? [])];
    // 已经存在临时组合替换。否则追加
    if (tempIndex > -1) {
      tempList.splice(tempIndex, 1, {
        combinationName: '自定义查询组合',
        id: templateVal,
        orgIds: targetKeys,
      });
    } else {
      tempList.push({
        combinationName: '自定义查询组合',
        id: templateVal,
        orgIds: targetKeys,
      });
    }

    setUnitGroupList?.(tempList);
  };

  // 根据选中组合获取树形数据
  const selectedTreeData = useMemo(() => {
    if (!orgOsCompanyList || !orgOsCompanyList.length) return [];
    const result = unitGroupList?.find((item) => item.id === groupId);
    return result ? formatTreeUnit(orgOsCompanyList, result) : orgOsTreeList;
  }, [groupId, orgOsCompanyList, orgOsTreeList, unitGroupList]);

  // 当前选中组合包含的orgids
  const selectedOrgIds = useMemo(() => {
    const result = unitGroupList?.find((item) => item.id === groupId);
    return result?.orgIds?.filter((item) => allOrgIds?.includes(item)) ?? allOrgIds;
  }, [allOrgIds, groupId, unitGroupList]);

  return [
    {
      unitGroupList,
      selectedTreeData,
      selectedOrgIds,
      allOrgIds,
      orgOsCompanyList,
      orgOsTreeList,
      loading: delLoading || saveLoading || getUnitsGroupLoading,
    },
    {
      setUnitGroupList,
      deleteUnitsGroupRun,
      saveUnitsGroupRun,
      onSearch,
    },
  ];
};
