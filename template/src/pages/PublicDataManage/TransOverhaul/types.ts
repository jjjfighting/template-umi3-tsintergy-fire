export type IDataStruct1 = Record<
  | 'dataItem'
  | 'startTime'
  | 'date'
  | 'deviceName'
  | 'endTime'
  | 'deviceType'
  | 'updateTime'
  | 'voltageLevel', // 电压等级
  string
>;

export type IDataStruct2 = Record<
  'overhaulPlanDTOList' | 'sdPublishOverhaulPlanDTOList',
  IDataStruct1[]
>;
