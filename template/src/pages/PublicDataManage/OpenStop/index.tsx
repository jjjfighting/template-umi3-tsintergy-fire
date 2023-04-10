/** 必开必停机组信息: 数据特殊, 自行维护 */
// 同机组检修信息
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import { marginGap } from '@/utils/constant';
import { Echarts5, useEchartsOption } from '@tsintergy/ppss';
import { Row, Table } from 'antd';
import Condition from './Condition';
import { getColumns } from './config';
import { useReqAid } from './hooks';

const Index = () => {
  const [{ runDates, showType, stopDataItem, loading }, { setRunDates, setShowType }] = useReqAid();

  return (
    <Page loading={loading}>
      <Condition
        stopDataItem={stopDataItem}
        runDates={runDates}
        showType={showType}
        setRunDates={setRunDates}
        setShowType={setShowType}
      />
      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <Echarts5
          optionOpts={{ notMerge: true }}
          option={useEchartsOption({
            xAxis: {
              type: 'category',
              data: stopDataItem.ticks ?? [],
            },
            yAxis: {
              type: 'value',
              scale: true,
              name: 'MW',
            },
            series: (() => {
              const daData = [
                {
                  type: 'line',
                  name: '必开机组总容量-计划',
                  data: stopDataItem?.daPosOrOpenArr,
                },
                {
                  type: 'line',
                  name: '必停机组总容量-计划',
                  data: stopDataItem.daNegOrStopArr,
                },
              ];
              const rtData = [
                {
                  type: 'line',
                  name: '必开机组总容量-实际',
                  data: stopDataItem.rtPosOrOpenArr,
                },
                {
                  type: 'line',
                  name: '必停机组总容量-实际',
                  data: stopDataItem.rtNegOrStopArr,
                },
              ];

              if (showType === 'all') {
                return [...daData, ...rtData];
              }
              if (showType === '1') {
                return daData;
              }
              if (showType === '2') {
                return rtData;
              }
              return [];
            })(),
          } as echarts.EChartsOption)}
        />
      </CardWrapper>

      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <Row
          justify="space-between"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: marginGap,
          }}
        >
          {/* 占位 */}
          <span />
          <span>单位: MW</span>
        </Row>
        <Table
          bordered
          rowKey="tick"
          pagination={false}
          scroll={{ x: 'max-content', y: 260 }}
          columns={getColumns(showType)}
          dataSource={stopDataItem.dataSource}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
