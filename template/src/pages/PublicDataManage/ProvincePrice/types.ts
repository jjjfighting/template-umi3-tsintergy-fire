export type IDataStruct = {
  /** 日期 */
  date: string;
  /** 更新日期 */
  dayAheadUpdateTime: string;
  /** 全省节点电价-日前 */
  dayAheadPrice: number[];
  /** 全省节点电价-实时 */
  runtimePrice: number[];
};
