export type IDataBlock = {
  /** 阻塞名 */
  blockName: string;
  /** 日期 */
  date: string;
  tvMeta: any;
  /** 日前更新时间 */
  updateTime: string;
  /** 日前正向极限 */
  daPosLimit: number[];
  /** 日前反向极限 */
  daNegLimit: number[];
  /** 实时正向极限 */
  rtPosLimit: number[];
  /** 实时反向极限 */
  rtNegLimit: number[];
};
