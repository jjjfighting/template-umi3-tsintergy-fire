import { request } from 'umi';
import type { ICombinationData, IUnitTree } from './types';

// 查询机组组合列表
export const getUnitsGroup = (): Promise<AjaxRes<ICombinationData[]>> => {
  return request(`${API_PREFIX}/api/org/combination`);
};

// 保存机组组合列表
export const saveUnitsGroup = (params: {
  id: string;
  combinationName: string;
  orgIds: string[];
}) => {
  return request(`${API_PREFIX}/api/org/combination`, {
    method: 'post',
    data: { ...params },
  });
};

// 删除机组组合
export const deleteUnitsGroup = (unitGroupId: string) => {
  return request(`${API_PREFIX}/api/org/combination/${unitGroupId}`, {
    method: 'delete',
  });
};

// 查询火电场站机组树
export const getUnitTree = (): Promise<AjaxRes<IUnitTree[]>> => {
  return request(`${API_PREFIX}/api/org/os/fire/unit/tree`);
};
