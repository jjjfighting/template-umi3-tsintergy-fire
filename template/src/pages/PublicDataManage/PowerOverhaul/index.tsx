/** 输变电检修信息 */
import CardWrapper from '@/components/CardWrapper';
import LabelsView from '@/components/LabelsView';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import { marginGap } from '@/utils/constant';
import Condition from './Condition';
import { getPowerColumns, showTypeEnum } from './config';
import { useRequestAid } from './hooks';

const Index = () => {
  const [{ loading, filtedData, showType, timeText }, { setShowType }] = useRequestAid();

  return (
    <Page loading={loading}>
      <Condition timeText={timeText} filtedData={filtedData} showType={showType} />
      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <LabelsView
          value={[showType]}
          dataSource={showTypeEnum}
          single
          onChange={(value) => {
            setShowType(value[0] as string);
          }}
          style={{ marginBottom: marginGap }}
        />
        <PageTable
          key={showType}
          bordered
          scroll={{ y: 600 }}
          rowKey="key"
          pagination={false}
          columns={getPowerColumns(showType)}
          dataSource={filtedData}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
