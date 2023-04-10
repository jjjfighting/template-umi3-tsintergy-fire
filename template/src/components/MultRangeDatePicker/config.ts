import type { Moment } from 'moment';

export const getTimestamp = (value: Moment) => {
  return value.startOf('day').valueOf();
};

export const getDimensionArr = (num: number, arr: string[]) => {
  const dimensionArr = [];
  while (arr.length > 0) {
    dimensionArr.push(arr.splice(0, num)?.map((Str) => Number(Str)));
  }
  return dimensionArr;
};
