export type IDataStruct = {
  /** 日期 */
  date: string;
  /** 更新日期 */
  rtUpdateTime: string;
  /** 日前 */
  dayAheadLoad: number[];
  /** 实时 */
  rtLoad: number[];
};
