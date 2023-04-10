import { useModel } from 'umi';

export type CommonEnum = {
  /** 场站类型 */
  businessType: OptionList;
  /** 计划类型 */
  planType: OptionList;
  system: OptionList;
  /** 24 | 96 */
  dataLen: OptionList;
  /** 是 | 否 */
  valid: OptionList;
  /** 机组状态 */
  unitStatus: OptionList;
  /** 检修类型 */
  overhaulType: OptionList;
  /** 开停机需求 */
  openStop: OptionList;
  /** 供热类型 */
  heatingType: OptionList;
  /** 场站子类型 */
  subType: OptionList;
  /** 分解曲线类型 */
  curveType: OptionList;
  /** 中长期-交易类型  */
  tradeType: OptionList;
  /** 中长期合约状态 */
  mltStatusEnum: OptionList;
  /** 日清算月累-枚举 */
  dataItem: OptionList;
};

export default (): CommonEnum => {
  const {
    initialState: { commonEnum },
  }: any = useModel('@@initialState'); // 获取getInitialState的返回共享数据
  return commonEnum || {};
};
