/** 备用信息 */
import CardWrapper from '@/components/CardWrapper';
import EchartBox from '@/pages/PublicDataManage/Common/EchartBox';
import TableBox from '@/pages/PublicDataManage/Common/TableBox';
import { getXAxisMarkLineSeries } from '@/utils/eChartUtils';
import { rageTimes } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import { useInitAid } from '../../../hooks';
import { getColumns } from './config';
import { getSdBackup } from './service';

const Index = () => {
  const [{ loading, allTicks, dataSet, showType, showMode, runDates }] = useInitAid(
    '备用信息',
    getColumns,
    getSdBackup,
  );

  return (
    <CardWrapper noPadding loading={loading}>
      <EchartBox
        option={{
          xAxis: {
            type: 'category',
            data: allTicks ?? [],
          },
          yAxis: {
            type: 'value',
            scale: true,
            name: 'MW',
          },
          series: (() => {
            const daData = [
              {
                type: 'line',
                name: '正备用-计划',
                data: dataSet?.daPosOrOpen ?? [],
              },
              {
                type: 'line',
                name: '负备用-计划',
                data: dataSet.daNegOrStop,
              },
            ];
            const rtData = [
              {
                type: 'line',
                name: '正备用-实际',
                data: dataSet.rtPosOrOpen,
              },
              {
                type: 'line',
                name: '负备用-实际',
                data: dataSet.rtNegOrStop,
              },
            ];
            const markLine = getXAxisMarkLineSeries({
              size: showMode === 'LEN_96' ? 96 : 24,
              num: 1,
              rageTimeData: rageTimes([runDates?.[0] as Moment, runDates?.[1] as Moment], YMD),
            });
            if (showType === 'all') {
              return [...daData, ...rtData, ...markLine];
            }
            if (showType === '1') {
              return [...daData, ...markLine];
            }
            if (showType === '2') {
              return [...rtData, ...markLine];
            }
            return [];
          })() as any[],
        }}
      />
      <TableBox />
    </CardWrapper>
  );
};

export default Index;
