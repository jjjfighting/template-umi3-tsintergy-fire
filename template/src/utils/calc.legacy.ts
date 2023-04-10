import { calc } from '@tsintergy/calc';
import { add, divide, multiply, subtract } from 'accurate';

/**
 * 返回number数据，默认是0
 * @param item
 */
export const toZero = (item: any) => Number(item || 0) || 0;
/**
 * 保留3位小数的乘法
 */
const multiplyFixed = (...arg: any) =>
  Number(multiply(arg?.flat(10)?.map((p: string | number) => toZero(p))).toFixed(3));
/**
 * 保留3位小数的除法
 */
const divideFixed = (...arg: any) =>
  Number(divide(arg?.flat(10)?.map((p: string | number) => toZero(p))).toFixed(3));

/**
 * 导出函数集，方便日后遇坑替换
 */
export const accCalc = {
  add: (...arg: any[]) => add(...arg?.flat(10)?.map((p: string | number) => toZero(p))),
  subtract: (...arg: any[]) => subtract(...arg?.flat(10)?.map((p: string | number) => toZero(p))),
  multiply: (...arg: any[]) => multiply(...arg?.flat(10)?.map((p: string | number) => toZero(p))),
  multiplyFixed,
  divide: (...arg: any[]) => divide(...arg?.flat(10)?.map((p: string | number) => toZero(p))),
  divideFixed,
};

/**
 * 均分函数，返回一个数组，对于除不尽的数字，如1/3，为[0.33,0.33,0.34]
 * @param score 被均分的数值
 * @param fraction 均分多少份
 * @param fixed
 */
export const average = (score: number, fraction: number, fixed: number = 3) => {
  if (fraction === 0) {
    return [];
  }
  const majorNum = divide(toZero(score), fraction).toFixed(fixed);
  const majorList = Array(fraction - 1)
    .fill(majorNum)
    .map((p) => toZero(p));
  const lastNum = subtract(toZero(score), majorList);
  return [...majorList, lastNum];
};

/**
 * 求平均值
 * @param list
 * @param fixed
 * @returns
 */
export const avg = (list?: number[], fixed: number = 3) => {
  if (!list || list.length === 0) {
    return 0;
  }
  return divide(add(list), list.length).toFixed(fixed);
};

/**
 * 求和
 * @param numbers 数字列表
 * @param fixed
 */
export const sumFixed = (numbers: any[], fixed: number = 3) => {
  if (!numbers || !numbers?.length) {
    return 0;
  }
  return add(numbers?.map((p) => toZero(p))).toFixed(fixed);
};

/**
 * 计算分页后的行序号
 * @param index
 * @param pageSize
 * @param current
 */
export const getSerialNumber = (index: number, pageSize: number, current: number) =>
  pageSize * (current - 1) + index + 1;

/**
 * 除法，如果被除数为0，返回0
 * @param divisor 除数
 * @param dividend 被除数
 */
export const zeroExcept = (divisor: any, dividend: any, fixed: number = 3) => {
  return toZero(dividend) ? divideFixed(toZero(divisor), toZero(dividend)).toFixed(fixed) : 0;
};

/**
 * 列求和
 * @param dataSource
 * @param key
 */
export const colSum = (dataSource: any[], key: string | number) => {
  return dataSource.reduce((acc: number, item: any) => {
    return add(acc, toZero(item[key]));
  }, 0);
};

/**
 * 算平均值
 * @param dataSource
 * @param key
 */
export const colSumAve = (dataSource: any[], key: string | number) => {
  return zeroExcept(colSum(dataSource, key), dataSource.length);
};

/**
 * 获取百分比，如果被除数为0，返回0
 * @param divisor 除数
 * @param dividend 被除数
 */
export const percent = (divisor: any, dividend: any) => {
  if (!toZero(dividend)) {
    return 0;
  }
  return Math.abs(divideFixed(toZero(divisor) * 100, toZero(dividend)));
};

/**
 * 如果不是数字，就返回0
 * @param number 任何数据
 */
export const naNToZero = (number: any) => {
  if (Number.isNaN(number)) {
    return 0;
  }
  return number;
};

/**
 * 两项列表计算 单项计算
 * [1,2,3,4,5]
 * [1,2,3,4,5]
 * =
 * [2,4,6,8,10]
 * @param mainList 主项
 * @param secendList
 * @param func
 */
export const listCalc = (
  mainList: (number | string)[],
  secendList: (number | string)[],
  func = add,
) => {
  // 如果一边的长度为0，直接返回另一边
  if (!mainList?.length && secendList?.length) {
    return secendList;
  }
  if (mainList?.length && !secendList?.length) {
    return mainList;
  }
  return mainList?.map((p, index) => func(p, toZero(secendList?.[index])));
};

/**
 * 超过maxLen保留maxLen位小数, 否者原样输出.
 * @param num 数字
 * @param maxLen 最大保留长度
 */
export const autoFixed = (num: any, maxLen = 2): any => {
  let res;
  // 如果是number，或者可以转成number的string，进行处理
  // 否则原样返回
  if (num === null || num === '' || Number.isNaN(Number(num))) {
    res = num;
  } else {
    /* 小数位数 */
    const decimalLength =
      num && num.toString().split('.')[1] && num.toString().split('.')[1]?.length;
    if (decimalLength) {
      if (decimalLength > maxLen) {
        /* 10 ** 0 = 1 */
        const numRank = 10 ** maxLen;
        /* 扩大对应位数 */
        const poweredNum = accCalc.multiply(num, numRank);
        /* 取整 */
        // 截断模式
        // const intPart = Math[num > 0 ? 'floor' : 'ceil'](poweredNum);
        // 四舍五入模式
        const intPart = Math.round(poweredNum);
        /* 还原小数部分，规范要求小数位不满精度'0' 填充(整数不需要) */
        res = accCalc.divide(intPart, numRank).toFixed(maxLen);
      } else {
        // 不足补0
        res = Number(num).toFixed(maxLen);
      }
    } else {
      // 不足补0
      res = Number(num).toFixed(maxLen);
    }
  }
  return res;
};
/**
 * 以千分位分隔的形式输出, 仅用于Table显示，不能用于Echart数据
 * @param num 数字
 */
export const separatorNumber = (num: any, maxLen?: number): any => {
  let res;
  if (Number.isNaN(Number(num))) {
    res = num;
  } else {
    res = Number(num)?.toLocaleString();
    // 规范要求小数位不满精度'0' 填充
    // 转换后小数位数
    const dataLength = (res && res.split('.')[1] && res.split('.')[1]?.length) || 0;
    if (maxLen) {
      if (dataLength === 0) res = res?.concat('.');
      if (dataLength < maxLen) {
        res = res?.concat(
          Array(maxLen - dataLength)
            .fill(0)
            .join(''),
        );
      } else {
        res = res?.substring(
          0,
          calc([res.indexOf('.'), maxLen, 1])
            .accAdd()
            .valueOfFirst(),
        );
      }
    }
  }
  return res;
};

// autoFixed + separatorNumber
export const autoFixed2Sep = (num: any, maxLen = 2): any => {
  return separatorNumber(autoFixed(num, maxLen), maxLen);
};

export const toWan = (value?: number | string) => accCalc.divide(toZero(value), 10000)?.toFixed(3);
