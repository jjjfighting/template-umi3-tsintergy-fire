export type IDataSource = {
  /** 日期 */
  date: string;
  /** 电厂名称 */
  osName: string;
  /** 理由 */
  reason: string;
  /** 开始时间 */
  startDate: string;
  /** 结束时间 */
  endDate: string;
  /** 机组数量 */
  unitNumber: number;
  /** 电压;(kV) */
  voltage: number;
};
