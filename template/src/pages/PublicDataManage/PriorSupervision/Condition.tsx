import CardWrapper from '@/components/CardWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import { Button, Form, Row } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { getExportExcelColumns } from './config';
import { exportExcel } from '@/utils/excelUtils';
import { useUpdateTimeAid } from '../hooks';
import { YMD } from '@/utils/timeUtils';
import { sortBy } from 'lodash';
import moment from 'moment';
import type { Moment } from 'moment';
import type { FC, ReactElement } from 'react';
import type { IData } from './type';
import { Model } from './model';

const Index: FC<{
  runDates: [Moment, Moment];

  dataSource?: IData[];
}> = ({ runDates, dataSource }): ReactElement => {
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
            {useUpdateTimeAid(dataSource ?? [], runDates, 'updateTime')}
          </Form.Item>
        </Form>
        <Button
          icon={<i className="icon ppsfont icon-daochu" />}
          type="link"
          onClick={() => {
            if (!runDates?.[0] || !runDates?.[1]) return;

            exportExcel({
              columnConfig: getExportExcelColumns(),
              data: (dataSource
                ? sortBy(dataSource, 'date', (o) => moment(o.date)).reverse()
                : []
              ).map(({ info, date }, index) => {
                return {
                  order: index + 1,
                  date: date.split(' ')[0],
                  info: info === '1' ? '触发事前监管' : '未触发事前监管',
                };
              }),
              filename: `事前监管信息（${runDates?.[0]?.format(YMD) ?? '-'}至${
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
