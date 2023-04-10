import Page from '@/components/Page';
import CardWrapper from '@/components/CardWrapper';
import Condition from './Condition';
import PageTable from '@/components/PageTable';
import { getColumnsOptions } from './config';
import { useRequest, useSelector } from 'umi';
import { getStorageData } from './service';
import { marginGap } from '@/utils/constant';
import { useEffect } from 'react';
import { sortBy } from 'lodash';
import moment from 'moment';
import type { FC, ReactElement } from 'react';
import { Model } from './model';

const Index: FC = (): ReactElement => {
  const { runDates } = useSelector(Model.selector);

  const { run, data, loading } = useRequest(getStorageData, {
    manual: true,
  });

  useEffect(() => {
    run({
      startDate: runDates?.[0],
      endDate: runDates?.[1],
    });
  }, [run, runDates]);

  return (
    <Page loading={loading}>
      <Condition dataSource={data} runDates={runDates} />

      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <PageTable
          bordered
          pagination={false}
          dataSource={data ? sortBy(data, 'date', (o) => moment(o.date)).reverse() : []}
          columns={getColumnsOptions()}
          scroll={{ x: 'max-content', y: 500 }}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
