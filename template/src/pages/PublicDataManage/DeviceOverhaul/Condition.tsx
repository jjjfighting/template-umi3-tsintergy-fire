import CardWrapper from '@/components/CardWrapper';
import RangeDatePicker from '@/components/RangeDatePicker';
import { publicModel } from '@/pages/PublicDataManage/model';
import { exportExcel } from '@/utils/excelUtils';
import { YMD } from '@/utils/timeUtils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useMount } from 'ahooks';
import { Button, Form, Input, Row, Select } from 'antd';
import type { FC } from 'react';
import { memo, useEffect } from 'react';
import { useSelector } from 'umi';
import { showTypeEnum } from '../config';
import type { IShowType } from '../types';
import { getColumns } from './config';

const Index: FC<{
  deviceName?: string;
  setDeviceName: Function;
  filtedData?: any[];
  timeText: string;
}> = ({ deviceName, setDeviceName, filtedData, timeText }) => {
  const { runDates, showType, tabName } = useSelector(publicModel.selector);
  const [form] = Form.useForm();

  useMount(() => {
    publicModel.actions.update({
      showType: showTypeEnum?.[1]?.value as IShowType | undefined,
    });
  });

  useEffect(() => {
    form.setFieldsValue({
      runDates,
      showType,
      deviceName,
    });
  }, [deviceName, form, runDates, showType]);

  return (
    <CardWrapper>
      <Row justify="space-between">
        <Form
          layout="inline"
          form={form}
          // onValuesChange={(changedValue, allValue) => {}}
          onFinish={(allValue) => {
            setDeviceName(allValue.deviceName);
            publicModel.actions.update({
              runDates: allValue.runDates,
              showType: allValue.showType,
            });
          }}
        >
          <Form.Item label="" name="deviceName">
            <Input max={10} placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item name="runDates" label="日期选择">
            <RangeDatePicker maxCount={1} maxType="year" allowClear={false} />
          </Form.Item>
          <Form.Item name="showType" label="数据展示">
            <Select style={{ width: 90 }} options={showTypeEnum.slice(1)} />
          </Form.Item>
          <Form.Item style={{ color: 'var(--neutral-color5)' }}>
            <ExclamationCircleFilled style={{ marginRight: 5 }} />
            {timeText}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={() => {
            if (!tabName || !runDates?.[0] || !runDates?.[1]) return;
            exportExcel({
              columnConfig: getColumns(),
              data: (filtedData ?? [])?.map((item, index) => ({
                order: index + 1,
                ...item,
                date: item?.date?.split(' ')?.[0],
              })),
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
