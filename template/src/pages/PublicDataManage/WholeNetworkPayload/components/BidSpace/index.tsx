/** 竞价空间 */
import CardWrapper from '@/components/CardWrapper';
import EchartWrapper from '@/pages/PublicDataManage/Common/EchartWrapper';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getCommonColumns } from '@/pages/PublicDataManage/config';
import { useInitAid } from '@/pages/PublicDataManage/hooks';
import { getBidSpace } from './service';

const Index = () => {
  const [{ loading }] = useInitAid(
    '竞价空间',
    getCommonColumns,
    getBidSpace,
    'updateTime daSpace rtSpace',
  );
  return (
    <CardWrapper noPadding loading={loading}>
      <EchartWrapper />
      <TableBox />
    </CardWrapper>
  );
};

export default Index;
