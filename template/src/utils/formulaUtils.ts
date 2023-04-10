import { average, toZero } from '@/utils/calc.legacy';
import { calc, evalCalc, format } from '@tsintergy/calc';
import { wan } from '@tsintergy/ppss';
import { findEnum } from './enum';

export interface TableSource {
  paramType?: string;
  id?: string;
  effectiveDate?: string;
  regularStationRate?: string;
  actualStationRate?: string;
  unitId?: string[];
  edit?: boolean;
  isNew?: boolean;
}

export interface UnitCostInter {
  effectiveDate?: string;
  unitId?: string;
  costType?: string;
  costFunctionType?: 'AX_B' | 'AX2_BX_C';
  formula?: string; // 公式
  valueA?: number; // A
  valueB?: number; // B
  valueC?: number; // C
  edit?: boolean;
  isNew?: boolean;
}

/**
 * 将一段线段分成10分，用于确定x轴的点
 * @param startPoint
 * @param endPoint
 * @returns
 */
export const getXPoint = (
  startPoint: string | number | undefined,
  endPoint: string | number | undefined,
) => {
  const diff = evalCalc.subtract(endPoint, startPoint);
  if (diff <= 0) {
    return [];
  }
  return [0, ...average(diff, 10, 0)].reduce((total: number[], item: number, index: number) => {
    if (index === 0) {
      return [toZero(startPoint)];
    }
    return [...total, evalCalc.add(item, total[index - 1])];
  }, []);
};

/**
 * 科学计数法
 * string值的转成int 的科学计数法
 * @param str
 * @returns
 */
export const fixScience = (str?: string | number | null) => {
  if (str === undefined || str === null || typeof str === 'number') {
    return str;
  }
  const eIndex = str?.toUpperCase()?.indexOf('E');

  if (eIndex === -1) {
    return toZero(str);
  }
  const divisor = toZero(str.slice(0, eIndex));
  const num = toZero(str.slice(eIndex + 2));
  const dividend = evalCalc.multiply(1, ...Array(num).fill('10'));

  if (dividend) {
    const reult = science2String(evalCalc.divide(divisor, dividend));
    return reult;
  }
  return 0;
};

/**
 * int 的科学计数法 转换成 string类型的文本
 * @param num
 * @returns
 */
const science2String = (num?: number) => {
  if (num === undefined || num === null) {
    return num;
  }
  const str = num.toString();
  const reg = /^(\d+\.\d+|\d+)(e)([\\-]?\d+)$/;
  let zero = '';

  /* 6e7或6e+7 都会自动转换数值 */
  if (!reg.test(str)) {
    return num;
  }

  /* 6e-7 需要手动转换 */

  /*  手动转换 */
  const arr = reg.exec(str);

  const len = Math.abs(toZero(arr?.[3])) - 1;
  for (let i = 0; i < len; i++) {
    zero += '0';
  }

  return `0.${zero}${arr?.[1]?.replace('.', '')}`;
};

/**
 *
 * @param startPoint
 * @param endPoint
 * @returns
 */
export const formula2Real = (
  formula: string,
  value: {
    a?: number;
    b?: number;
    c?: number;
  },
): string => {
  if (!formula) {
    return '';
  }
  const realA = fixScience(value.a?.toString());
  const realB = fixScience(value.b?.toString());
  const realC = fixScience(value.c?.toString());
  let result = formula;
  if (toZero(value.a) === 0) {
    result = result.replace('ax + ', '').replace('ax² + ', '');
  }
  if (toZero(value.a) === 1) {
    result = result.replace('a', '');
  }
  result = result.replace('a', `${realA}`);
  if (toZero(value.b) === 0) {
    result = result.replace('bx + ', '').replace('+ bx', '').replace('bx', '').replace('b', '0');
  }
  if (toZero(value.b) === 1) {
    result = result.replace('bx', 'x').replace('b', '1');
  }
  if (toZero(value.b) > 0) {
    result = result.replace('b', `${realB}`);
  }
  if (toZero(value.b) < 0) {
    result = result.replace('+ b', `- ${Math.abs(toZero(realB))}`).replace('b', `${realB}`);
  }
  if (value?.c === 0) {
    result = result.replace('+ c', '').replace('c', '0');
  }
  if (toZero(value?.c) > 0) {
    result = result.replace('c', `${realC}`);
  }
  if (toZero(value?.c) < 0) {
    result = result.replace('+ c', `- ${Math.abs(toZero(realC))}`).replace('c', `${realC}`);
  }
  return `y = ${result}`;
};

export const formulaTypes = [
  { id: 'AX_B', name: 'ax + b' },
  { id: 'AX2_BX_C', name: 'ax² + bx + c' },
];

// 格式化为非线性函数
export const formatFuncFit = (
  data: Partial<UnitCostInter & { functionType: string }> | undefined,
) => {
  if (!data) return '';
  const { functionType, valueA, valueB, valueC } = data;
  const formula = findEnum(formulaTypes, functionType);

  return formula2Real(formula, {
    a: valueA,
    b: valueB,
    c: valueC,
  });
};

/** 数值转为万 */
export const transformToWan = (
  value: number | undefined | string | null,
  fixed = 2,
  unitStr = '',
) => {
  return `${format(calc(value).divide(wan).valueOfFirst(), { fallback: '-', fixed })}${unitStr}`;
};
