// 阶梯图配置
import { autoFixed } from '@/utils/calc.legacy';
import { getXAxisMarkLineSeries } from '@/utils/eChartUtils';
import { rageTimes } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { useSelector } from 'umi';
import EchartBox from '../Common/EchartBox';
import { publicModel } from '../model';

// 计划，或实际
const Index: FC<{ unit?: string; legendText?: [string, string]; padding?: boolean }> = ({
  unit,
  legendText,
  padding = false,
}) => {
  const { dataSet, tabName, allTicks, showType, runDates, showMode } = useSelector(
    publicModel.selector,
  );

  return (
    <EchartBox
      style={{ height: 450 }}
      option={{
        xAxis: [
          {
            type: 'category',
            data: allTicks ?? [],
          },
        ],
        grid: {
          bottom: 60,
          right: 50,
        },
        yAxis: [
          {
            name: unit ?? 'MW',
            type: 'value',
            scale: true,
          },
        ],
        dataZoom: [
          {
            bottom: 10,
            left: 110,
            right: 110,
            type: 'slider',
            xAxisIndex: [0, 1],
          },
          {
            type: 'inside',
            xAxisIndex: [0, 1],
          },
        ],
        series: ((): any[] => {
          const da = [
            {
              type: 'line',
              name: `${tabName ?? ''}-${legendText?.[0] ?? '计划'}`,
              step: true,
              data: dataSet.daData,
              markLine: {
                label: {
                  formatter: ({ value }: { value: number }) => autoFixed(value),
                },
                data: [
                  {
                    name: '平均值',
                    type: 'average',
                  },
                ],
              },
              markPoint: {
                symbolSize: [70, 60],
                label: {
                  formatter: ({ value }: { value: number }) => autoFixed(value),
                },
                data: [
                  {
                    name: '最大值',
                    type: 'max',
                  },
                ],
              },
            },
          ];
          const rt = [
            {
              type: 'line',
              name: `${tabName ?? ''}-${legendText?.[1] ?? '实际'}`,
              step: true,
              data: dataSet.rtData,
              markLine: {
                label: {
                  formatter: ({ value }: { value: number }) => autoFixed(value),
                },
                data: [
                  {
                    name: '平均值',
                    type: 'average',
                  },
                ],
              },
              markPoint: {
                symbolSize: [70, 60],
                label: {
                  formatter: ({ value }: { value: number }) => autoFixed(value),
                },
                data: [
                  {
                    name: '最大值',
                    type: 'max',
                  },
                ],
              },
            },
          ];
          const markLine = getXAxisMarkLineSeries({
            size: showMode === 'LEN_96' ? 96 : 24,
            num: 1,
            rageTimeData: rageTimes([runDates?.[0] as Moment, runDates?.[1] as Moment], YMD),
          });
          if (showType === '1') return [...da, ...markLine];
          if (showType === '2') return [...rt, ...markLine];
          if (showType === 'all') return [...da, ...rt, ...markLine];
          return [];
        })(),
      }}
      padding={padding}
    />
  );
};

export default Index;
