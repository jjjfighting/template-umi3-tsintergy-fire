/** 机组检修信息: 数据特殊, 自行维护 */
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import { marginGap } from '@/utils/constant';
import { useMount, useUnmount } from 'ahooks';
import { Row, Table } from 'antd';
import { useSelector } from 'umi';
import EchartBox from '../Common/EchartBox';
import { publicModel } from '../model';
import Condition from './Condition';
import { getColumns } from './config';
import { useReqAid } from './hooks';

const Index = () => {
  const { showType } = useSelector(publicModel.selector);

  // 初始化名称
  useMount(() => {
    publicModel.actions.update({
      tabName: '机组检修信息',
    });
  });
  // 离开时重置数据, 但是日期公用不重置
  useUnmount(() => {
    publicModel.actions.update({
      showMode: 'LEN_96',
      updateTime: null,
      tabName: undefined,
      dataSourceOne: undefined,
      dataSourceAll: undefined,
      columns: [],
      dataSet: {},
    });
  });

  const [{ capacityItem, loading }] = useReqAid();

  return (
    <Page loading={loading}>
      <Condition capacityItem={capacityItem} />
      <EchartBox
        style={{ height: 420 }}
        option={{
          xAxis: [
            {
              type: 'category',
              data: capacityItem.ticks ?? [],
            },
          ],
          grid: {
            bottom: 60,
            right: 50,
          },
          yAxis: [
            {
              name: 'MW',
              type: 'value',
              scale: true,
            },
          ],
          dataZoom: [
            {
              bottom: 10,
              left: 110,
              right: 110,
              type: 'slider',
              xAxisIndex: [0, 1],
            },
            {
              type: 'inside',
              xAxisIndex: [0, 1],
            },
          ],
          series: (() => {
            const daData = [
              {
                type: 'line',
                name: '机组检修信息-计划',
                data: capacityItem.daData,
              },
            ];
            const rtData = [
              {
                type: 'line',
                name: '机组检修信息-实际',
                data: capacityItem.rtData,
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
          })() as any[],
        }}
      />
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
          rowKey="date"
          pagination={false}
          scroll={{ x: 'max-content', y: 300 }}
          columns={getColumns(showType, '机组检修信息')}
          dataSource={capacityItem.dataSource ?? []}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
