/* eslint-disable no-bitwise */
// -----------------------------------------------------------------------------
// 工具函数集
// -----------------------------------------------------------------------------

import { accCalc, autoFixed, toZero } from '@/utils/calc.legacy';
import { YMD } from '@tsintergy/ppss';
import html2canvas from 'html2canvas';
import { cloneDeep, divide, get, map, mean, omitBy, orderBy, round, sum, sumBy } from 'lodash';
import type { Moment } from 'moment';
import { rageTimesDate } from './timeUtils';

/* 输入名称中不允许存在特殊字符: \/:?？*[] */
export const unusualChartTest = (str: string): boolean => /[\\/:?？*[\]]/.test(str);

/**
 * 简单获取后缀名
 * @param name
 */
export function getSuffix(name?: string) {
  return name?.split('.')?.pop();
}

/**
 * 获取 sessionStorage
 * @param key
 */
export function getSsessionStorage(key: string) {
  if (window.sessionStorage) {
    const str = sessionStorage.getItem(key);
    const o = str ? JSON.parse(str) : str;
    if (!o) {
      return null;
    }
    return o.value;
  }
  return window[Number(key)];
}

/**
 * 设置 sessionStorage
 * @param {object} key
 * @param {object} key.asd - as
 * @param {*} value
 */
export function setSsessionStorage(key: string, value: any, days = 1) {
  if (window.sessionStorage) {
    if (!value) {
      localStorage.removeItem(key);
    } else {
      const saveDay = days; // 默认保留1天
      const exp = new Date();
      sessionStorage.setItem(
        key,
        JSON.stringify({
          value,
          expires: exp.getTime() + saveDay * 24 * 60 * 60 * 1000,
        }),
      );
    }
  } else {
    window[Number(key)] = value;
  }
}

/**
 * 判断对象是否存在 key，无论该 key 对应的值是否为空
 * @param object
 * @param key
 */
export const hasKey = (object: object, key: string) => !!Object.keys(object).find((k) => k === key);

/**
 * 去除值无效的字段
 *
 * undefined || null || '' || 'undefined' || 'null'
 */
export const omitInvalidFields = (object: object): any =>
  omitBy(
    object,
    (v) => v === undefined || v === null || v === '' || v === 'undefined' || v === 'null',
  );

/**
 * 按 key 升序提取出值，组装为数组
 *
 * 例如：{ date: '2020-09-09', 5: 555, 1: 888, 0: null } => [null, 888, empty × 3, 555]
 * @param object
 * @returns
 */
export const getValueByKeyAsc = (object?: any) =>
  object
    ? Object.keys(object)
        .filter((k) => !Number.isNaN(Number(k)))
        .reduce((acc, k) => {
          acc[Number(k)] = object[k];
          return acc;
        }, [] as any[])
    : [];

/**
 * 列表转对象，index为key
 * @param list 纯列表
 */
export const list2Obj = (list: any[]) => {
  if (!list || list.length === 0) {
    return {};
  }
  return list?.reduce((total: any, p: any, index: number) => {
    return { ...total, [`${index}`]: p };
  }, {});
};

/**
 * 列表转对象，index为key
 * @param list 纯列表
 */
export const list2Obj2 = (list: any[] = [], keyName: string = 'id', valueName: string = 'name') => {
  if (!list || list.length === 0) {
    return {};
  }
  return list?.reduce((total: any, p: any, index: number) => {
    return { ...total, [`${p[keyName]}`]: p?.[valueName] };
  }, {});
};

/* 对象转列表，index为key 和上面互补
 * @param obj 对象
 * @param length 长度
 */
export const obj2List = (obj: any, length: number) => {
  if (toZero(length) === 0) {
    return [];
  }
  return Array(toZero(length))
    .fill('')
    .map((_p, index) => obj?.[index]);
};

interface Obj2TableInter {
  key: string;
  list: any[];
}

/**
 * 单列表转化成为表格列表
 * 横纵转换
 * 列表第一行为主key，主导长度
 *
 * 例如 传入
 * [
 *   {key: 'time' ,list: [1, 2, 3] },
 *   {key: 'value' ,list: [22, 44, 99, 100] },
 * ]
 *
 * ==> 输出
 * [ {time: 1, value: 22}, {time: 2, value: 44}, {time: 3, value: 99}]
 */
export const obj2TableList = (list: Obj2TableInter[]) => {
  if (!list || list.length === 0) {
    return [];
  }
  const primaryList = list[0].list;
  return primaryList?.reduce((total: any, item, index: number) => {
    const nItem: any = list.reduce((itemObj, keyList) => {
      return {
        ...itemObj,
        [`${keyList.key}`]: keyList?.list?.[index],
        key: index,
      };
    }, {});
    return [...total, nItem];
  }, []);
};

/**
 * 对象转FormData
 * @param obj
 */
export const obj2FormData = (obj: any) => {
  const formData = new FormData();
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};

/**
 * 调节颜色变浅或变暗
 * @param color 十六进制颜色（非缩写）
 * @param percent 正数变浅，负数变暗
 */
export function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = ~~((R * (100 + percent)) / 100);
  G = ~~((G * (100 + percent)) / 100);
  B = ~~((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
  const GG = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
  const BB = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);

  return `#${RR}${GG}${BB}`;
}

type Routes = {
  title: string;
  path: string;
  component?: string;
  routes?: Routes;
}[];

type RouteList = {
  title: string;
  path: string;
  component: string;
}[];

/**
 * 得到路由叶节点列表
 * @param acc
 * @param list
 */
const flattenRoutes = (acc: RouteList, list: Routes) => {
  list.forEach((item) => {
    if (item.routes) {
      flattenRoutes(acc, item.routes);
    } else if (item.component) {
      acc.push({
        title: item.title,
        path: item.path,
        component: item.component,
      });
    }
  });
  return acc;
};

/**
 * 计算 获取元素顶部到页面可见区域底部的距离
 */
export const getRefTopToPageBottomDistance = ({
  ref,
  className,
}: {
  ref?: React.MutableRefObject<null | HTMLElement>;
  className?: string;
}): number => {
  let targetElement = null;
  if (ref !== undefined && ref?.current) {
    targetElement = ref.current;
  }
  if (className !== undefined) {
    targetElement = document.querySelector(`.${className}`);
  }

  const bodyClientHeight = document.body.clientHeight;
  const refTopToPageTop = targetElement?.getBoundingClientRect?.().top;
  return (Number(bodyClientHeight) || 0) - (Number(refTopToPageTop) || 0);
};

/**
 * 计算 table 顶部到页面可见区域底部的距离（基于 getRefTopToPageBottomDistance ）
 */
export const getTableScrollHeight = (className: string, minHeight: number = 200): number => {
  // 额外减去pagination(64)高度
  const distance = accCalc.subtract(
    getRefTopToPageBottomDistance({
      className,
    }),
    64,
  );
  return distance > minHeight ? distance : minHeight;
};

/**
 * 一维的路由列表
 */
export const allRouteList = flattenRoutes([], ROUTES as any[]);

export const dom2canvas = ({
  ref,
  className,
  width,
  height,
}: {
  ref?: React.MutableRefObject<null | HTMLElement>;
  className?: string;
  width?: number;
  height?: number;
}): undefined | Promise<HTMLCanvasElement | undefined> => {
  let targetElement: HTMLElement | null = null;
  if (ref !== undefined && ref?.current) {
    targetElement = ref.current;
  }
  if (className !== undefined) {
    targetElement = document.querySelector(`.${className}`);
  }
  if (!targetElement) return undefined;

  const { offsetWidth, offsetHeight } = targetElement;
  return new Promise((resolve, reject) => {
    html2canvas(targetElement as HTMLElement, {
      width: width || offsetWidth,
      height: height || offsetHeight,
    })
      .then((canvas) => {
        if (!canvas) return resolve(undefined);
        return resolve(canvas);
      })
      .catch((err: any) => {
        window.console.log('dom2canvas方法：转换dom时出错了');
        reject(err);
      });
  });
};

/**
 * 控制换行字数
 * @param word 原始文本
 * @param maxLen 每行最长长度
 * @returns
 */
export const wordCrlf = (word: string, maxLen: number) => {
  const num = maxLen;
  const lines = [...word].reduce(
    (acc, val, i) => {
      if (i > 0 && i % num === 0) {
        acc.push(val);
      } else {
        acc[acc.length - 1] += val;
      }
      return acc;
    },
    [''],
  );
  return lines.join('\r\n');
};

/**
 * 数组转对象
 *
 * 通常可以用 {...array} 代替这个方法，但这个方法可以简化复杂的参数表达式
 */
export const array2Object = (array: any[] | undefined): Record<number, any> => {
  return {
    ...array,
  };
};

/**
 * 一个数组分化出正负数组
 *
 * [-1,0,1] => { positive:[0,0,1], negative:[-1,0,0] }
 */
export const getPosNegArrayObject = (array: number[] = []) => {
  const ret = array.reduce(
    (acc, val, i) => {
      if (val >= 0) {
        acc.positive[i] = val;
      } else {
        acc.negative[i] = val;
      }
      return acc;
    },
    {
      positive: Array(array.length).fill(0),
      negative: Array(array.length).fill(0),
    },
  );
  return ret as { positive: number[]; negative: number[] };
};

/**
 * 格式化 echarts series 数据，默认保留两位小数
 * @param array echarts series 数组
 * @param maxLen
 * @returns
 */
export const seriesDataFixed = (array: any[], maxLen = 2) =>
  array.map((item) => ({
    ...item,
    data:
      item?.data && Array.isArray(item.data)
        ? item.data.map((v: any) => autoFixed(v, maxLen))
        : undefined,
  }));

/**
 * 格式化 Table 数据，默认保留两位小数
 * @param array dataSource 数组
 * @param excludeKeys 排除格式化的项
 * @param maxLen
 * @returns
 */
export const dataSourceFixed = (array: any[], excludeKeys: string[], maxLen = 2) =>
  array.map((item) => {
    return Object.keys(item).reduce((acc: any, key) => {
      if (excludeKeys.indexOf(key) >= 0) {
        acc[key] = item[key];
      } else {
        acc[key] = autoFixed(item[key] ?? '-');
      }
      return acc;
    }, {});
  });

/** 从大到小排序, 除了前size项, 其余合并到'其他项' */
export const maxHeapWithOther = (
  source: any[] = [],
  /** 默认的键: name value */
  mapKey: string | { valueKey?: string; nameKey?: string } = 'value',
  size: number = 5,
  otherName: string = '其他',
): typeof result => {
  const _valueKey = typeof mapKey === 'string' ? mapKey : mapKey?.valueKey ?? 'value';
  const _nameKey = typeof mapKey === 'string' ? 'name' : mapKey?.nameKey ?? 'name';
  const shadow = orderBy(cloneDeep(source), [_valueKey], 'desc');
  const total = sumBy(shadow, _valueKey);

  // 最终返回: 总计, 结果数组, 其余项
  const result: { total: number; list: typeof source; other: any | undefined } = {
    total,
    list: [],
    other: undefined,
  };

  if (shadow?.length <= size) {
    result.list = shadow;
  } else {
    const maxList = shadow?.slice(0, size);
    const otherList = shadow?.slice(size);
    const other = { [_nameKey]: otherName, [_valueKey]: sumBy(otherList, _valueKey) };
    result.other = other;
    result.list = [...maxList, other];
  }
  return result;
};

/** 算术平均, 排除无效数据 */
export const effectMean = (
  arr: (number | null | undefined)[] | undefined,
  sign: number = 4,
  fallback: number | string | undefined = undefined, // 全为空的回退值, 默认undefined
): typeof fallback => {
  const effectArr = (arr ?? [])?.filter((num) => typeof num === 'number');
  if (!effectArr?.length) return fallback;
  return round(mean(effectArr), sign);
};

export const effecMeanBy = (
  objArr: any[] | undefined,
  path: string,
  sign: number = 4,
  fallback: number | string | undefined = undefined,
) => effectMean(map(objArr, path), sign, fallback);

/** 求和, 如果全没有数据不会返回0 */
export const effectSum = (
  arr: (number | null | undefined)[] | undefined,
  sign: number = 4,
  fallback: number | string | undefined = undefined, // 全为空的回退值, 默认undefined
): typeof fallback => {
  const effectArr = (arr ?? [])?.filter((num) => typeof num === 'number');
  if (!effectArr?.length) return fallback;
  return round(sum(effectArr), sign);
};

export const effectSumBy = (
  objArr: any[] | undefined,
  path: string,
  sign: number = 4,
  fallback: number | string | undefined = undefined,
): typeof fallback => effectSum(map(objArr, path), sign, fallback);

/** 排序, lodash.orderBy对于null, undefined的排序不符合业务: 应该放到最后 */
export const effectOrderBy = (
  objArr: any[] | undefined,
  path: string,
  orders: 'desc' | 'asc' = 'desc', // 默认是降序
) => orderBy(objArr, (item) => get(item, path) ?? Number.NEGATIVE_INFINITY, orders);

// 求除法
export const effectDivide = (
  num1: number | undefined | null,
  num2: number | undefined | null,
): number | undefined | null => {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') return undefined;
  return num1 && num2 ? round(divide(num1, num2), 4) : 0;
};

/**
 * 缝合时间关系的列表，未匹配到的时间补充undefined
 * @param runDate
 * @param listData
 * @param point
 */
export const sutureDateListData = (
  runDates: [Moment, Moment],
  listDatas: { runDate: string; list: (string | number)[] }[],
  point: 96 | 24 = 96,
) => {
  const runDateStrList = rageTimesDate(runDates, YMD);
  return runDateStrList.reduce((total: (string | number | undefined)[], date) => {
    const dataList = listDatas.find((p) => p.runDate === date)?.list;
    const targetList =
      dataList?.length === point
        ? dataList
        : Array(point)
            .fill(undefined)
            .map((_p) => undefined); // 避免array创建出来的undefined指针地址相同
    return [...total, ...targetList];
  }, []);
};

/**
 * 未退役机组 = 过滤查询时间之前已退役机组
 * @param unitList 待过滤的机组列表
 * @param queryDate 查询时间
 */
export const getUnretiredUnitList = (unitList: FIRE_BASE.Units[], queryDate: Moment) =>
  unitList?.filter((item) => {
    return !item?.retirementTime || queryDate?.isSameOrBefore(item?.retirementTime, 'day');
  }) ?? [];
