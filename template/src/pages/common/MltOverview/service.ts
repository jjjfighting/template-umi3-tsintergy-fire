// 接口文档
import { request } from 'umi';
import type { xxxDataType } from './types';

export const xxx = (): PromiseRes<xxxDataType> => {
  return request(`${API_PREFIX}/api/`, {
    method: 'get',
    params: {},
  });
};

export const yyy = (): PromiseRes<void> => {
  return request(`${API_PREFIX}/api/`, {
    method: 'post',
    data: {},
  });
};
