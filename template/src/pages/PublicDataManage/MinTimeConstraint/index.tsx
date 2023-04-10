/* 日前开机不满最小约束时间机组名单 */
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import useInitialState from '@/hooks/useInitialState';
import { marginGap } from '@/utils/constant';
import { exportExcel } from '@/utils/excelUtils';
import { YMD } from '@tsintergy/ppss';
import { Button, DatePicker, Form, Row } from 'antd';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useRequest, useSelector } from 'umi';
import { dataSourceWithOrder, sortByTenantName } from '../config';
import { getColumns } from './config';
import { getDissatisfaction } from './services';
import { Model } from './model';

const Index: FC = () => {
  const { runDate } = useSelector(Model.selector);
  const [form] = Form.useForm();

  const {
    userInfo: { tenantName },
  } = useInitialState();

  const {
    run: runDissatisfaction,
    data,
    loading,
  } = useRequest(getDissatisfaction, {
    manual: true,
  });

  useEffect(() => {
    runDissatisfaction({
      date: runDate,
    });
  }, [runDate, runDissatisfaction]);

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
                  startTime: item?.startTime ? item.startTime : ' ', // 避免自动转为0
                  endTime: item?.endTime ? item.endTime : ' ',
                })),
                filename: `日前开机不满最小约束时间机组名单(${runDate?.format(YMD)})`,
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
          rowKey="key"
          pagination={false}
          columns={getColumns()}
          dataSource={dataSourceWithOrder(sortByTenantName(data, tenantName))}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
