import { Space } from 'antd';
import { useAccess } from 'umi';

export interface AccessBoxInt {
  type:
    | 'company'
    | 'organization'
    | 'supAdmin'
    | 'sjcExportSegment'
    | 'editSpotAvgPrice'
    | 'sxFireSimulation'
    | 'algorithm'
    | 'clearPriceDownload'
    | 'bidSpaceDownload'
    | 'transferDownload'
    | 'newEnergyDownload'
    | 'outSendDownload'
    | 'overhaulDownload'
    | 'posNegSpareDownload'
    | 'openStopUnitDownload'
    | 'deviceOverhaulDownload'
    | 'sectionBoundDownload'
    | 'rtClearSpotEleDownload'
    | 'channelInfoDownload'
    | 'rtSectionDownload'
    | 'rtNodePriceDownload'
    | 'fmPriceDownload'
    | 'clearInfoDownload'
    | 'discontinueBootDownload'
    | 'energyForcecastDownload'
    | 'windForecastDownload'
    | 'pvForecastDownload';
  children: any;
  space?: boolean;
}

const Index = (props: AccessBoxInt) => {
  const { type, space = false, children } = props;
  const access = useAccess();
  if (space) {
    return <Space>{access[type] ? children : <></>}</Space>;
  }
  return <>{access[type] ? children : <></>}</>;
};

export default Index;
