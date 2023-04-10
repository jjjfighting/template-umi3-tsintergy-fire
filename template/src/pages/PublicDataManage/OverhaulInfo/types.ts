export type IDataStruct = {
  /** 日期 */
  date: string;
  /** 更新日期 */
  updateTime: string;
  /** 全省节点电价-日前 */
  dayAheadCapacity: number[];
  /** 全省节点电价-实时 */
  rtCapacity: number[];
};
