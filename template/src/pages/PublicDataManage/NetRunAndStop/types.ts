export type IDataSource = {
  /** 日期 */
  date: string;
  /** 设备名称 */
  deviceName: string;
  /** 设备类型 */
  deviceType: string;
  /** 影响发电设备 */
  influenceDevice: string;
  /** 计划送点时间 */
  planTime: string;
  /** 停役时间 */
  stopTime: string;
  /** 电压;kV */
  voltage: number;
};
