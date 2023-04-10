/** 试验机组总加 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getSdCommonData } from '@/pages/PublicDataManage/service';

const Index = () => {
  const [{ loading }] = useInitAid('试验机组总加', getCommonColumns, getSdCommonData('710', '717'));

  return (
    <Page loading={loading}>
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
