export type IShowType = '1' | '2' | 'all';
export type IShowMode = 'LEN_96' | 'LEN_24';

export type ICommonStruct = {
  date: string;
  updateTime: string;
  daData: (number | null)[];
  rtData: (number | null)[];
};

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
