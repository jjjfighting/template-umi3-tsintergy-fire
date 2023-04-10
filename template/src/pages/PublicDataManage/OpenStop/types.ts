export type IDataStop = {
  /** 日期 */
  date: string;
  tvMeta: any;
  /** 日前更新时间 */
  updateTime: string;
  /** 日前正或必开数据 */
  daPosOrOpen: number[];
  /** 日前负或必停数据 */
  daNegOrStop: number[];
  /** 实时正或必开数据 */
  rtPosOrOpen: number[];
  /** 实时负或必停数据 */
  rtNegOrStop: number[];
};
