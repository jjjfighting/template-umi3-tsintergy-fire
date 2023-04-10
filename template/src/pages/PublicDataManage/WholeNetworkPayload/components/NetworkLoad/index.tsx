/** 全网负荷 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getStorageData } from './service';

const Index = () => {
  const [{ loading }] = useInitAid('全网负荷', getCommonColumns, getStorageData('735', '736'));

  return (
    <Page loading={loading}>
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
