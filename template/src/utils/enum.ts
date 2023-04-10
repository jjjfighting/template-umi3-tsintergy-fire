import type { CommonEnum } from '@/hooks/useEnumHook';

let netWorkEnum: CommonEnum;

export const getNetWorkEnum = () => netWorkEnum || {};

/**
 * 查找的枚举列表名字
 * @param enumList 枚举列表
 * @param id 对应id
 */
export const findEnum = (enumList: OptionList, id: string | number | undefined) => {
  if (!enumList || enumList.length === 0 || id === undefined) {
    return '';
  }
  return enumList?.find((p) => `${p.id}` === `${id}`)?.name || '';
};

/**
 * 日期类型
 */
export const dataEnum: { id: string; name: string }[] = [
  { id: '1', name: '工作日' },
  { id: '2', name: '周六' },
  { id: '3', name: '周日' },
  { id: '4', name: '节假日' },
];

/**
 * 路由的类型
 */
export enum ROUTERTYPE {
  MEUN = 3, // 菜单
  TOKEN = 4, //  令牌
  API = 5, // api
}

/**
 * 算法执行状态
 */
export const algorithmStatus = {
  '0': '算法未执行',
  undefined: '算法未执行',
  '1': '算法正在执行...',
  '2': '算法执行成功',
  '3': '算法执行失败',
  '4': '算法异常终止',
};
