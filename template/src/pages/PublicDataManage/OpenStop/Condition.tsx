import CardWrapper from '@/components/CardWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import { exportExcel } from '@/utils/excelUtils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { YMD } from '@tsintergy/ppss';
import { Button, Form, Row, Select } from 'antd';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { useEffect } from 'react';
import { showTypeEnum } from '../config';
import type { IShowType } from '../types';
import { getColumns, getExcelDataSource } from './config';

const Index: FC<{
  stopDataItem: any;
  runDates: [Moment, Moment];
  showType: IShowType;
  setRunDates: Function;
  setShowType: Function;
}> = ({ stopDataItem, runDates, showType, setRunDates, setShowType }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      runDates,
      showType,
    });
  }, [form, runDates, showType]);

  return (
    <CardWrapper shadow>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          onValuesChange={(_changedValue, allValue) => {
            setShowType(allValue.showType);
            setRunDates(allValue.runDates);
          }}
        >
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker
              maxCount={1}
              maxType="year"
              allowClear={false}
              // onCalendarChange={(val, _dateStrings, info) => {
              //   if (info.range === 'end') {
              //     setRunDates(val as [Moment, Moment]);
              //   }
              // }}
            />
          </Form.Item>
          <Form.Item name="showType" label="数据展示">
            <Select style={{ width: 90 }} options={showTypeEnum} />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ marginRight: 5 }} />
            {stopDataItem.timeText}
          </Form.Item>
        </Form>
        <Button
          onClick={() => {
            if (!runDates?.[0] || !runDates?.[1]) return;
            exportExcel({
              columnConfig: [
                {
                  title: '日期',
                  dataIndex: 'tick',
                },
                ...getColumns(showType).slice(1),
              ],
              data: getExcelDataSource(
                stopDataItem.ticks,
                stopDataItem.daPosOrOpenArr,
                stopDataItem.daNegOrStopArr,
                stopDataItem.rtPosOrOpenArr,
                stopDataItem.rtNegOrStopArr,
              ),
              filename: `必开必停 (${runDates[0].format(YMD)}至${runDates[1].format(YMD)})`,
              tableHeaderNumber: 0,
              nullPlaceholder: '',
            });
          }}
          icon={<i className="icon ppsfont icon-daochu" />}
          type="link"
        >
          下载数据
        </Button>
      </Row>
    </CardWrapper>
  );
};

export default Index;
