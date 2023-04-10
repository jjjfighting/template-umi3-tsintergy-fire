import type { Moment, unitOfTime } from 'moment';
import moment from 'moment';
import { getSession } from './constant';
import { setSsessionStorage } from './tool';

export const YMDHms = 'YYYY-MM-DD HH:mm:ss';
export const YMDHm = 'YYYY-MM-DD HH:mm';
export const YMDH0 = 'YYYY-MM-DD HH:00';
export const Y = 'YYYY';
export const YMD = 'YYYY-MM-DD';
export const YMD2 = 'YYYYMMDD';
export const YMD3 = 'YYYY/M/D';
export const YM2 = 'YYYYMM';
export const MD = 'MM-DD';
export const M = 'MM';
export const YM = 'YYYY-MM';
export const Hms = 'HH:mm:ss';
export const Hm = 'HH:mm';
export const H = 'HH';
export const cnYMD = 'YYYY年MM月DD日';
export const cnMD = 'MM月DD日';
export const weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
export const offDays = ['星期天', '星期六'];
export const months = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];
export const numberMonths = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

export const numberAllMonths = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

/*
 * 返回一个 11:11 形式的时间
 * @param time 分钟数
 * @returns {string}
 */
export const getHourAndMin = (time: number, type = 0) => {
  let hour: string | number = Math.floor(time / 60);
  let min: string | number = Math.floor(time % 60);
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;
  return type === 0 ? `${hour}:${min}` : `t${hour}${min}`;
};

/**
 * 返回一个时间点的数组
 * @param count
 * @param range
 * @param startTime
 * @param type
 * @returns {Array}
 */
export const getTimePoints = (count = 96, range = 24 * 60, type = 0) => {
  const result = [];
  let counter = 0;
  while (counter < count) {
    result.push(
      type === 0
        ? getHourAndMin((counter / count) * range)
        : getHourAndMin((counter / count) * range, type),
    );
    counter += 1;
  }
  return result;
};

/**
 * 获取96点数组
 * '0' 国网 [ '00:15' ,..., '24:00' ] 中广核
 * '1' 南网 [ '00:00' ,..., '23:45' ]
 * 获取24点数组
 * '0' 国网 [ '01:00' ,..., '24:00' ] 中广核
 * '1' 南网 [ '00:00' ,..., '23:00' ]
 */
export const getPointsList = (point: 24 | 96, type: '0' | '1' = '0') => {
  const points = getTimePoints(point);
  if (type === '0') {
    // 国网
    const specialPoint = points.slice(1);
    specialPoint.push('24:00');
    return specialPoint;
  }
  // 南网
  return points;
};

/**
 * 获取当月每日日期
 * @param date 时间
 * @param unit 单位
 */
export const monthDays = (date: number | string, unit = '') =>
  Array(moment(date).daysInMonth())
    .fill('')
    .map((p, index) => `${index + 1}${unit}`);

/**
 * 获取当月每日日期 1-31 2-28 格式
 * @param date 时间
 */
export const monthAndDays = (date: number | string) => {
  const month = moment(date).format('M');
  return Array(moment(date).daysInMonth())
    .fill('')
    .map((p, index) => `${month}-${index + 1}`);
};

/**
 * 获取月份中的日期
 * moment => ['2021-01-01','2021-01-02',...,'2021-01-31']
 */
export const getMonthDays = (date: Moment, format = YMD) =>
  Array(date.daysInMonth())
    .fill(null)
    .map((v, i) =>
      moment(date)
        .date(i + 1)
        .format(format),
    );

/**
 * 获取整个月的24 | 96点数 1-31 00:15 格式
 * @param date 时间
 */
export const monthTimes = (date: number | string, point: 24 | 96 = 96, type: '0' | '1' = '0') => {
  const month = moment(date).format('M');
  return Array(moment(date).daysInMonth())
    .fill('')
    .reduce((total, p, index) => {
      return [
        ...total,
        ...getPointsList(point, type).map((time) => `${month}-${index + 1} ${time}`),
      ];
    }, []);
};

/**
 * 获取范围月每日日期 默认 1-31 2-28 格式
 * @param date 时间
 */
export const rageTimes = (
  date: [Moment, Moment],
  format = 'M-DD',
  type: unitOfTime.Diff = 'days',
) => {
  if (!date || date.length !== 2) {
    return [];
  }
  const startTime = date[0];
  const endTime = date[1];
  const listLength = moment(endTime)?.diff(moment(startTime), type) + 1 || 0;
  if (listLength < 0) {
    return [];
  }
  return Array(listLength)
    .fill('')
    .map((p, index) => moment(startTime).add(index, type).format(format));
};

/**
 * 找出一个范围日期内 目标日期的下标
 * @param rageDays  范围日期
 * @param targetDay 目标日志
 * @returns
 */
export const findDayInRageIndex = (
  rageDays: [Moment | string | undefined, Moment | string | undefined],
  targetDay: Moment | string | undefined,
) => {
  const startTime = moment(rageDays[0]);
  const endTime = moment(rageDays[1]);
  const targetDayMoment = moment(targetDay);
  const listLength = endTime?.diff(startTime, 'days') + 1 || 0;
  if (listLength < 0) {
    return -1;
  }
  const rageDaysMoment: Moment[] = Array(listLength)
    .fill('')
    .reduce((total, _p, index) => {
      return [...total, moment(startTime).add(index, 'days')];
    }, []);
  return rageDaysMoment.findIndex((p) => p.isSame(targetDayMoment, 'days'));
};

/**
 * 获取范围月每日日期 默认 1-31 2-28 格式 + 96点 或 24点
 * @param date 时间
 */
export const rageTimesPoints = (
  date: [Moment, Moment],
  format = 'M-DD',
  point: 24 | 96 = 96,
  type: '0' | '1' = '0',
): string[] => {
  if (!date || date.length !== 2) {
    return [];
  }
  const startTime = date[0];
  const endTime = date[1];
  const listLength = moment(endTime)?.diff(moment(startTime), 'days') + 1 || 0;
  if (listLength < 0) {
    return [];
  }
  return Array(listLength)
    .fill('')
    .reduce((total, p, index) => {
      const day = moment(startTime).add(index, 'days').format(format);
      return [...total, ...getPointsList(point, type).map((time) => `${day} ${time}`)];
    }, []);
};

/**
 * 两个moment之间的日期
 * @param date
 * @param format
 * @returns
 */
export const rageTimesDate = (date: [Moment, Moment], format = 'YYYY-MM-DD'): string[] => {
  if (!date || date.length !== 2) {
    return [];
  }
  const startTime = date[0];
  const endTime = date[1];
  const listLength = moment(endTime)?.diff(moment(startTime), 'days') + 1 || 0;
  if (listLength < 0) {
    return [];
  }
  return Array(listLength)
    .fill('')
    .reduce((total, p, index) => {
      const day = moment(startTime).add(index, 'days').format(format);
      return [...total, day];
    }, []);
};

export const ymdReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

/**
 * 年内的月份
 * @returns {Array}
 */
export const getAllMonth = () => {
  const tmp = [];
  for (let i = 1; i <= 12; i += 1) {
    tmp.push(`${i}月`);
  }
  return tmp;
};

/**
 * 月内的日
 * @returns {Array}
 */
export const getAllDay = (time = moment().format(YMD), format = YMD) => {
  const length = moment(time, format).daysInMonth();
  const tmp = [];
  for (let i = 1; i <= length; i++) {
    tmp.push(`${i}日`);
  }
  return tmp;
};

export const MonthInYearList = getAllMonth();
export const dayInMonthList = getAllDay();
// 24点
export const timePoints24 = getPointsList(24);
export const timePoints24Southern = getPointsList(24, '1');

// 96点
export const timePoints96 = getPointsList(96);
export const timePoints96Southern = getPointsList(96, '1');

export interface TvMeta {
  startDateTime: string;
  delta: string | number;
  deltaUnit: string | number;
  size: string | number;
  totalSize?: string | number;
}

/**
 * 中广核 00:15 开始
 * 获取对应点数的tvMeta OBject
 * 目前对应 96 24
 */
export const getTvMetaObj = (
  points: string | number = 96,
  date?: null | moment.Moment | string,
) => {
  if (Number(points) === 24) {
    return {
      startDateTime: moment(date || undefined).format('YYYY-MM-DD 01:00:00'),
      delta: 1,
      deltaUnit: 2,
      size: 24,
    };
  }
  return {
    startDateTime: moment(date || undefined).format('YYYY-MM-DD 00:15:00'),
    delta: 15,
    deltaUnit: 1,
    size: 96,
  };
};

/**
 * 通过mate配置计算出时间节点
 * @param {
 * obj.startDateTime 开始时间 YYYY-MM-DD hh:mm:ss
 * obj.delta         数据点时间间隔
 * obj.deltaUnit     时间间隔单位   0:s; 1:m; 2:h; 3:D; 4:M; 5:Y
 * obj.size          点数量
 * }obj
 * @format format数据列表
 * @isTotal 是否展示一天总数
 */
export const getMetaPointList = (obj: TvMeta | undefined, format: string = '', isTotal = false) => {
  let realFormat = YMDHms;
  if (!obj || !obj.startDateTime) {
    return [];
  }

  if (Number(obj.size) > 600) {
    return [];
  }

  const hmReg = /^(20|21|22|23|[0-1]\d):[0-5]\d$/;
  // 兼容YYYY-MM-DD HH:mm:ss和HH:mm两种形式的返回
  if (obj.startDateTime && hmReg.test(obj.startDateTime)) {
    realFormat = Hm;
  }
  let deltaUnit: any = 'seconds';
  const resultList: any[] = [];
  switch (obj.deltaUnit) {
    case 0:
      deltaUnit = 'seconds';
      break;
    case 1:
      deltaUnit = 'minutes';
      break;
    case 2:
      deltaUnit = 'hours';
      break;
    case 3:
      deltaUnit = 'days';
      break;
    case 4:
      deltaUnit = 'months';
      break;
    case 5:
      deltaUnit = 'year';
      break;
    default:
      deltaUnit = 'seconds';
      break;
  }
  for (let i = 0; i < (isTotal && obj.totalSize ? obj.totalSize : obj.size); i++) {
    resultList.push(moment(obj.startDateTime, realFormat).add(i * Number(obj.delta), deltaUnit));
  }
  if (format) {
    return resultList.map((p: Moment) => {
      let time = p.format(format);
      // 适配00:15-24:00
      const zeroIndex = time.indexOf('00:00');
      if (zeroIndex === 0 || (zeroIndex >= 1 && time[zeroIndex - 1] !== ':')) {
        time = p.subtract(1, 'day').format(format);
        time = time.replace('00:00', '24:00');
      }
      return time;
    });
  }
  return resultList;
};

/**
 * 查询当天96点中最接近的时刻点的索引和时刻
 * @param {string} time
 */
export const getClosestTime = (time = moment().format(Hm), timeIndexOnly = true) => {
  const timeList = [
    { value0: '00', value1: 0 },
    { value0: '15', value1: 15 },
    { value0: '30', value1: 30 },
    { value0: '45', value1: 45 },
  ];
  const timeSplit = time.split(':');
  const minute = Number(timeSplit[1]);
  let minGapTime = '00';
  for (let i = 0; i < timeList.length; i += 1) {
    const gap = minute - timeList[i].value1;
    if (gap >= 0 && gap < 15) {
      minGapTime = timeList[i].value0;
    }
  }
  const closestTime = `${timeSplit[0]}:${minGapTime}`;
  const timeIndex = timePoints96.findIndex((ele) => ele === closestTime);
  return timeIndexOnly ? timeIndex : { time: closestTime, index: timeIndex };
};

/**
 * 得到行序对应时段
 * @param index
 * @param tradePeriod
 */
export const getPeriod = (index: number, tradePeriod: 24 | 96) => {
  let timeList: string[] = [];
  if (tradePeriod === 24) {
    timeList = timePoints24;
  } else if (tradePeriod === 96) {
    timeList = timePoints96;
  }
  return timeList[index];
};

/**
 * 获取今日
 */
export const getGlobalCurrentDay = () => {
  const globalCurrentDay = getSession('globalCurrentDay');
  if (globalCurrentDay && ymdReg.test(globalCurrentDay)) {
    return globalCurrentDay;
  }
  return moment().format(YMD);
};

/**
 * 获取今日 Moment格式
 */
export const getGlobalCurrentDayMoment = (): Moment => {
  return moment(getGlobalCurrentDay());
};

/**
 * 默认日期范围
 */
export const defaultDateRange: Readonly<Moment[]> = [
  getGlobalCurrentDayMoment().subtract(1, 'day'),
  getGlobalCurrentDayMoment().add(1, 'day'),
];

/**
 * 当前月份范围
 */
export const currentMonthRange: Readonly<Moment[]> | null | undefined = [
  getGlobalCurrentDayMoment().startOf('month'),
  getGlobalCurrentDayMoment().endOf('month').startOf('date'),
];

/**
 * 设置 今日
 */
export const setGlobalCurrentDay = (date: string | Moment | null) => {
  setSsessionStorage('globalCurrentDay', moment(date || undefined).format(YMD));
};

// 获取两个日期中间的月
export const getTweDayMonth = (startDate: string, endDate: string) => {
  const dateStart = moment(startDate);
  const dateEnd = moment(endDate);
  const timeValues = [];

  while (dateEnd.isAfter(dateStart) || dateStart.isSame(dateEnd, 'month')) {
    timeValues.push(dateStart.format(YM));
    dateStart.add(1, 'month');
  }
  return timeValues;
};

// 获取对应点数的时间范围
export const getPointsRangeList = (point: 24 | 96) => {
  const p1 = getPointsList(point, '0');
  const p2 = getPointsList(point, '1');
  return p2.map((item, index) => {
    return `${item}~${p1[index]}`;
  });
};

/**
 * 获取两个日期之前的天数
 * 假定你已经保证了startDate 小于endDate，且二者不相等
 * @param startDate
 * @param endDate
 */
export const getDaysPoint = (startDate: Moment, endDate: Moment) => {
  const daysList = [];
  const SDate = moment(startDate);
  const EDate = moment(endDate);
  daysList.push(SDate.format(YMD));
  while (SDate.add(1, 'days').isBefore(EDate)) {
    // 注意这里add方法处理后SDate对象已经改变。
    daysList.push(SDate.format(YMD));
  }
  daysList.push(EDate.format(YMD));
  return daysList;
};
