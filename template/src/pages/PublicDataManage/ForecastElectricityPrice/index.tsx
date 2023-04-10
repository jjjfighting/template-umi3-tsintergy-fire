/** 全省节点电价预测 */
import Page from '@/components/Page';
import Condition from './Condition';
import EchartWrapper from '../Common/EchartWrapper2';
import TableBox from '../Common/TableBox';
import { showTypeEnum_province } from '../config';
import { useInitAid } from '../hooks';
import { getColumns } from './config';
import { getProvincePrice } from './service';

const Index = () => {
  const [{ loading }] = useInitAid('全省节点电价预测', getColumns, getProvincePrice('739', '740'));

  return (
    <Page loading={loading}>
      <Condition selfShowTypeEnum={showTypeEnum_province} tipsText="日前" />
      <EchartWrapper unit="元/MWh" legendText={['日前', '实时']} padding />
      <TableBox cardShadow={true} unit="元/MWh" padding />
    </Page>
  );
};

export default Index;
