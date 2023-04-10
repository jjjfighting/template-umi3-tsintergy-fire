/** 联络线受电负荷 */
import Page from '@/components/Page';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getSdCommonData } from '@/pages/PublicDataManage/service';
import { useOutgoingInfoReqAid } from './hooks';

const Index = () => {
  const [{ loading }] = useInitAid(
    '联络线受电负荷',
    getCommonColumns,
    getSdCommonData('705', '711'),
  );
  useOutgoingInfoReqAid();

  return (
    <Page loading={loading}>
      <EchartWrapper />
      <TableBox />
    </Page>
  );
};

export default Index;
