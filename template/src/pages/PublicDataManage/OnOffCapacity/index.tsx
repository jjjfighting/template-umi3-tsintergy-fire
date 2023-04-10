import Page from '@/components/Page';
import CardWrapper from '@/components/CardWrapper';
import Condition from './Condition';
import PageTable from '@/components/PageTable';
import { Echarts5, useEchartsOption } from '@tsintergy/ppss';
import { getGlobalCurrentDayMoment } from '@/utils/timeUtils';
import { getEchartsOptions, getColumnsOptions } from './config';
import { marginGap } from '@/utils/constant';
import { useState, useEffect } from 'react';
import { getStorageData } from './service';
import { autoFixed } from '@/utils/calc.legacy';
import type { IData } from '../types';
import type { Moment } from 'moment';
import type { FC, ReactElement } from 'react';
import { Model } from './model';
import { useSelector } from 'react-redux';

const Index: FC = (): ReactElement => {
  const [dataSource, setDataSource] = useState<Record<'openedData' | 'stopData', IData[]>>({
    openedData: [],
    stopData: [],
  });

  const { runDates } = useSelector(Model.selector);

  useEffect(() => {
    Promise.all([
      getStorageData(
        {
          startDate: runDates?.[0],
          endDate: runDates?.[1],
        },
        '007',
      ),
      getStorageData(
        {
          startDate: runDates?.[0],
          endDate: runDates?.[1],
        },
        '008',
      ),
    ]).then((res) => {
      setDataSource({
        openedData: res?.[0]?.data ?? [],
        stopData: res?.[1]?.data ?? [],
      });
    });
  }, [runDates]);

  return (
    <Page>
      <Condition dataSource={dataSource} />

      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <Echarts5
          height={400}
          optionOpts={{ notMerge: true }}
          option={useEchartsOption(getEchartsOptions(runDates, dataSource))}
        />

        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>单位：MW</div>
        <PageTable
          bordered
          pagination={false}
          dataSource={
            dataSource.openedData.length || dataSource.stopData.length
              ? [
                  {
                    type: '必开容量-计划',
                    ...dataSource.openedData?.map(({ daData }) =>
                      daData?.[0] ? autoFixed(daData[0]) : '-',
                    ),
                  },
                  {
                    type: '必停容量-计划',
                    ...dataSource.stopData?.map(({ daData }) =>
                      daData?.[0] ? autoFixed(daData[0]) : '-',
                    ),
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
