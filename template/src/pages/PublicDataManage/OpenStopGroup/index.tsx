/* 日前必开必停机组组合 */
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import useInitialState from '@/hooks/useInitialState';
import { marginGap } from '@/utils/constant';
import { exportExcel } from '@/utils/excelUtils';
import { YMD } from '@tsintergy/ppss';
import { Button, DatePicker, Form, Row } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useRequest, useSelector } from 'umi';
import { dataSourceWithOrder, sortByTenantName } from '../config';
import { getColumns } from './config';
import { getCombine } from './services';
import { Model } from './model';

const Index: FC = () => {
  const { runDate } = useSelector(Model.selector);
  const [form] = Form.useForm();

  const {
    userInfo: { tenantName },
  } = useInitialState();

  const {
    run: runConbine,
    data,
    loading,
  } = useRequest(getCombine, {
    manual: true,
  });

  useEffect(() => {
    runConbine({
      date: runDate,
    });
  }, [runConbine, runDate]);

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
                  startDate: item?.startDate ? item.startDate : ' ', // 避免自动转为0
                  endDate: item?.endDate ? item.endDate : ' ',
                })),
                filename: `日前必开必停机组组合(${runDate?.format(YMD)})`,
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
          rowKey="osName"
          pagination={false}
          columns={getColumns()}
          dataSource={dataSourceWithOrder(sortByTenantName(data, tenantName))}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
