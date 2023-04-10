/** 抽蓄 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getStorageData } from './service';

const Index = () => {
  const [{ loading }] = useInitAid('抽蓄', getCommonColumns, getStorageData('737', '714'));
  return (
    <Page loading={loading}>
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
