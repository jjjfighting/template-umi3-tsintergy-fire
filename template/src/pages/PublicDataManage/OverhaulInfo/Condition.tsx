import CardWrapper from '@/components/CardWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import { publicModel } from '@/pages/PublicDataManage/model';
import { exportExcel } from '@/utils/excelUtils';
import { YMD } from '@/utils/timeUtils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Form, Row, Select } from 'antd';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { memo, useEffect } from 'react';
import { useSelector } from 'umi';
import { showTypeEnum } from '../config';
import type { IShowType } from '../types';

const Index: FC<{ capacityItem?: any }> = ({ capacityItem }) => {
  const { runDates, runDate, showType, showMode, tabName, columns } = useSelector(
    publicModel.selector,
  );
  const [form] = Form.useForm();

  useMount(() => {
    publicModel.actions.update({
      showType: showTypeEnum?.[0]?.value as IShowType | undefined,
    });
  });

  useEffect(() => {
    form.setFieldsValue({
      runDates,
      showType,
      showMode,
    });
  }, [form, runDates, showMode, showType]);

  return (
    <CardWrapper>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          onValuesChange={(changedValue, allValue) => {
            // 运行时间，单独更新
            if (Reflect.has(changedValue, 'runDates')) {
              publicModel.actions.update({
                runDates: changedValue.runDates,
                runDate: runDate.isBetween(
                  changedValue.runDates?.[0],
                  changedValue.runDates?.[1],
                  'day',
                  '[]',
                )
                  ? runDate
                  : (changedValue.runDates?.[0] as Moment),
              });
              return;
            }
            publicModel.actions.update(allValue);
          }}
        >
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker
              maxCount={1}
              maxType="year"
              allowClear={false}
              //  onCalendarChange={(val, _dateStrings, info) => {
              //   if (info.range === 'end') {
              //     publicModel.actions.update({
              //       runDates: val as [Moment, Moment],
              //       runDate: runDate.isBetween(val?.[0], val?.[1], 'day', '[]')
              //         ? runDate
              //         : (val?.[0] as Moment),
              //     });
              //   }
              // }}
            />
          </Form.Item>
          <Form.Item name="showType" label="数据展示">
            <Select style={{ width: 90 }} options={showTypeEnum} />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ marginRight: 5 }} />
            {capacityItem?.timeText}
          </Form.Item>
        </Form>
        <Button
          onClick={() => {
            if (!tabName || !runDates?.[0] || !runDates?.[1]) return;
            exportExcel({
              columnConfig: [
                {
                  title: '日期',
                  dataIndex: 'date',
                },

                ...(columns ?? [])?.slice(1),
              ],
              data: capacityItem?.dataSource ?? [],
              filename: `${tabName ?? '-'}(${runDates?.[0]?.format(YMD) ?? '-'}至${
                runDates?.[1]?.format(YMD) ?? '-'
              })`,
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
