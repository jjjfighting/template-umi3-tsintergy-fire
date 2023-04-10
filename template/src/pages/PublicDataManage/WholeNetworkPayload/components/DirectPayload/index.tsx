/** 直调负荷 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getDirectLoad } from './service';

const Index = () => {
  const [{ loading }] = useInitAid(
    '直调负荷',
    getCommonColumns,
    getDirectLoad,
    'rtUpdateTime dayAheadLoad rtLoad',
  );

  return (
    <Page loading={loading}>
      {/* <CommonCondition /> */}
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
