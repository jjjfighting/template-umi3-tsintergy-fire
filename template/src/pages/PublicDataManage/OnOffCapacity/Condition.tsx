import CardWrapper from '@/components/CardWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import { Button, Form, Row } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getExportExcelColumns } from './config';
import { useUpdateTimeAid } from '../hooks';
import { exportExcel } from '@/utils/excelUtils';
import { autoFixed } from '@/utils/calc.legacy';
import { YMD } from '@/utils/timeUtils';
import type { FC, ReactElement } from 'react';
import type { IData } from '../types';
import { Model } from './model';
import { useSelector } from 'react-redux';

const Index: FC<{
  dataSource?: Record<'openedData' | 'stopData', IData[]>;
}> = ({ dataSource }): ReactElement => {
  const { runDates } = useSelector(Model.selector);

  const [form] = Form.useForm();

  return (
    <CardWrapper shadow>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          initialValues={{
            runDates,
          }}
          onValuesChange={(changedValue) => {
            if (Reflect.has(changedValue, 'runDates')) {
              Model.actions.update({ runDates: changedValue.runDates });
            }
          }}
        >
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker maxCount={1} maxType="year" allowClear={false} />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ color: 'var(--neutral-color3)', marginRight: 5 }} />
            {useUpdateTimeAid(dataSource?.openedData ?? [], runDates, 'updateTime')}
          </Form.Item>
        </Form>
        <Button
          icon={<i className="icon ppsfont icon-daochu" />}
          type="link"
          onClick={() => {
            if (!runDates?.[0] || !runDates?.[1]) return;

            exportExcel({
              columnConfig: getExportExcelColumns(),
              data: (dataSource?.openedData ?? []).map(({ daData, date }, index) => {
                return {
                  order: index + 1,
                  date: date.split(' ')[0],
                  type: '预测总容量（MW）',
                  openUnit: daData?.[0] ? autoFixed(daData[0]) : '',
                  stopUnit: dataSource?.stopData?.[index]?.daData[0]
                    ? autoFixed(dataSource.stopData[index].daData[0])
                    : '',
                };
              }),
              filename: `必开必停机组信息（${runDates?.[0]?.format(YMD) ?? '-'}至${
                runDates?.[1]?.format(YMD) ?? '-'
              })）`,
              tableHeaderNumber: 0,
              nullPlaceholder: '',
            });
          }}
        >
          下载数据
        </Button>
      </Row>
    </CardWrapper>
  );
};

export default Index;
