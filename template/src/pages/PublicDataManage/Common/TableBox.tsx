/** Table组件 */
import CardWrapper from '@/components/CardWrapper';
import { marginGap } from '@/utils/constant';
import { DatePicker, Row, Space, Table } from 'antd';
import type { FC } from 'react';
import { useSelector } from 'umi';
import { publicModel } from '../model';

const Index: FC<{ cardShadow?: boolean; unit?: string; padding?: boolean }> = ({
  cardShadow = false,
  unit = 'MW',
  padding = false,
}) => {
  const { runDate, runDates, columns, dataSourceOne } = useSelector(publicModel.selector);

  return (
    <CardWrapper noPadding={!padding} style={{ marginTop: marginGap }}>
      <Row
        justify="space-between"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: marginGap,
        }}
      >
        <Space>
          日期选择:
          <DatePicker
            allowClear={false}
            value={runDate}
            disabledDate={(currentDate) => {
              return !currentDate?.isBetween(runDates?.[0], runDates?.[1], 'day', '[]');
            }}
            onChange={(val) => {
              if (val) publicModel.actions.update({ runDate: val });
            }}
          />
        </Space>
        <span>单位: {unit}</span>
      </Row>
      <Table
        bordered
        rowKey="wholeTick"
        pagination={false}
        scroll={{ x: 'max-content', y: 260 }}
        columns={columns ?? []}
        dataSource={dataSourceOne ?? []}
      />
    </CardWrapper>
  );
};

export default Index;
