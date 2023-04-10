type IDataKey =
  | 'createTime'
  | 'dataItem'
  | 'dataType'
  | 'date'
  | 'id'
  | 'info'
  | 'provinceAreaId'
  | 'updateTime';

export type IData = Record<IDataKey, string> & { versionNo: number };
