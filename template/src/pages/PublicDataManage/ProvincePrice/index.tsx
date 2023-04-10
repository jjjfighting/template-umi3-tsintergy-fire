/** 全省节点电价 */
import Page from '@/components/Page';
import Condition from '@/pages/PublicDataManage/Common/Condition';
import EchartWrapper from '../Common/EchartWrapper';
import TableBox from '../Common/TableBox';
import { showTypeEnum_province } from '../config';
import { useInitAid } from '../hooks';
import { getColumns } from './config';
import { getProvincePrice } from './service';

const Index = () => {
  const [{ loading }] = useInitAid(
    '全省节点电价',
    getColumns,
    getProvincePrice,
    'dayAheadUpdateTime dayAheadPrice runtimePrice',
  );

  return (
    <Page loading={loading}>
      <Condition selfShowTypeEnum={showTypeEnum_province} tipsText="日前" isModalWrapper />
      <EchartWrapper unit="元/MWh" legendText={['日前', '实时']} padding />
      <TableBox cardShadow={true} unit="元/MWh" padding />
    </Page>
  );
};

export default Index;
