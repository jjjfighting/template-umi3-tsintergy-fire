/* 电网设备停运情况 */
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import { marginGap } from '@/utils/constant';
import { exportExcel } from '@/utils/excelUtils';
import { YMD } from '@tsintergy/ppss';
import { Button, DatePicker, Form, Row } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useRequest, useSelector } from 'umi';
import { dataSourceWithOrder } from '../config';
import { getColumns } from './config';
import { getDeviceStop } from './services';
import { Model } from './model';

const Index: FC = () => {
  const { runDate } = useSelector(Model.selector);
  const [form] = Form.useForm();

  const {
    run: runDeviceStop,
    data,
    loading,
  } = useRequest(getDeviceStop, {
    manual: true,
  });

  useEffect(() => {
    runDeviceStop({
      date: runDate,
    });
  }, [runDate, runDeviceStop]);

  useEffect(() => {
    form.setFieldsValue({
      runDate,
    });
  }, [form, runDate]);

  return (
    <Page loading={loading}>
      <CardWrapper shadow>
        <Row justify="space-between">
          <Form
            form={form}
            layout="inline"
            onValuesChange={(changedValue) => {
              Model.actions.update({ runDate: changedValue.runDate });
            }}
          >
            <Form.Item name="runDate" label="日期">
              <DatePicker allowClear={false} />
            </Form.Item>
          </Form>
          <Button
            icon={<i className="icon ppsfont icon-daochu" />}
            type="link"
            onClick={() => {
              exportExcel({
                columnConfig: getColumns(),
                data: (data ?? [])?.map((item, index) => ({
                  order: index + 1,
                  ...item,
                  stopTime: item?.stopTime ? item.stopTime : ' ', // 避免自动转为0
                  planTime: item?.planTime ? item.planTime : ' ',
                })),
                filename: `电网设备停运情况(${runDate?.format(YMD)})`,
                nullPlaceholder: '',
              });
            }}
          >
            下载数据
          </Button>
        </Row>
      </CardWrapper>
      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <PageTable
          bordered
          scroll={{ y: 600 }}
          rowKey="comparedValues"
          pagination={false}
          columns={getColumns()}
          dataSource={dataSourceWithOrder(data)}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
