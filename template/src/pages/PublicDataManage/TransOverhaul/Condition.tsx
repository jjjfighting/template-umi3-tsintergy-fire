import CardWrapper from '@/components/CardWrapper';
import { ResetButton } from '@/components/ComButtons';
import RangeDatePicker from '@/components/RangeDatePicker';
import { findEnum } from '@/utils/enum';
import { exportExcel } from '@/utils/excelUtils';
import { getGlobalCurrentDayMoment, YMD } from '@/utils/timeUtils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Row } from 'antd';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { memo } from 'react';
import { dataTypeEnum, getTransColumns, showTypeEnum } from './config';
import { Model } from './model';

type IProps = {
  filtedData?: any[];
  timeText: string;
  showType: string;
  dataType?: string | null;
};

const Index: FC<IProps> = ({ filtedData, timeText, showType, dataType }) => {
  const { runDates } = useSelector(Model.selector);
  const [form] = Form.useForm();
  const initRunDates = [
    getGlobalCurrentDayMoment().subtract(13, 'day'),
    getGlobalCurrentDayMoment().add(1, 'day'),
  ];

  useEffect(() => {
    form.setFieldsValue({
      runDates,
    });
  }, [form, runDates]);

  return (
    <CardWrapper shadow>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          onFinish={(allValue) => {
            Model.actions.update({ runDates: allValue.runDates });
          }}
        >
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker maxCount={1} maxType="year" allowClear={false} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <ResetButton
              onClick={() => {
                Model.actions.update({ runDates: initRunDates as [Moment, Moment] });
              }}
            />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ color: 'var(--neutral-color3)', marginRight: 5 }} />
            {timeText}
          </Form.Item>
        </Form>
        <Button
          onClick={() => {
            if (!runDates?.[0] || !runDates?.[1]) return;
            exportExcel({
              columnConfig: getTransColumns(showType),
              data: (filtedData ?? [])?.map((item, index) => ({
                order: index + 1,
                ...item,
                date: item?.date?.split(' ')?.[0],
              })),
              filename: `输变电检修${findEnum(showTypeEnum, showType) ?? '-'}-${
                dataType ? findEnum(dataTypeEnum, dataType) : ''
              }(${runDates?.[0]?.format(YMD) ?? '-'}至${runDates?.[1]?.format(YMD) ?? '-'})`,
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

export default memo(Index);
