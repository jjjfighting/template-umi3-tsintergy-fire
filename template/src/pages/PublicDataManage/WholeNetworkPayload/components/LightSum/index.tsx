/** 光伏总加 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getSdCommonData } from '@/pages/PublicDataManage/service';

const Index = () => {
  const [{ loading }] = useInitAid('光伏总加', getCommonColumns, getSdCommonData('707', '713'));

  return (
    <Page loading={loading}>
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
