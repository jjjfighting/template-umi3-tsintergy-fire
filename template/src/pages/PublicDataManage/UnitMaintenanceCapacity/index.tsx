import Page from '@/components/Page';
import CardWrapper from '@/components/CardWrapper';
import Condition from './Condition';
import PageTable from '@/components/PageTable';
import { Echarts5, useEchartsOption } from '@tsintergy/ppss';
import { getEchartsOptions, getColumnsOptions } from './config';
import { marginGap } from '@/utils/constant';
import { useEffect } from 'react';
import { useRequest, useSelector } from 'umi';
import { getStorageData } from './service';
import { autoFixed } from '@/utils/calc.legacy';
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
      <Condition dataSource={data} />

      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <Echarts5
          height={400}
          optionOpts={{ notMerge: true }}
          option={useEchartsOption(getEchartsOptions(runDates, data ?? []))}
        />
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>单位：MW</div>
        <PageTable
          bordered
          pagination={false}
          dataSource={
            data?.length
              ? [
                  {
                    type: '机组检修容量-计划',
                    ...data?.map(({ daData }) => (daData?.[0] ? autoFixed(daData[0]) : '-')),
                  },
                ]
              : []
          }
          columns={getColumnsOptions(runDates)}
          scroll={{ x: 'max-content', y: 500 }}
          style={{ marginTop: marginGap }}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
