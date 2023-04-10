// 偏差图配置
import { autoFixed } from '@/utils/calc.legacy';
import { getXAxisMarkLineSeries } from '@/utils/eChartUtils';
import { rageTimes } from '@/utils/timeUtils';
import { tooltipLinkFormatter, YMD } from '@tsintergy/ppss';
import type { Moment } from 'moment';
import type { FC } from 'react';
import { useSelector } from 'umi';
import EchartBox from '../Common/EchartBox';
import { colSubrtact } from '../config';
import { publicModel } from '../model';
import { getLocalStorageTheme, themeColors } from '@tsintergy/ppss';

const Index: FC<{ unit?: string; legendText?: [string, string]; padding?: boolean }> = ({
  unit,
  legendText,
  padding = false,
}) => {
  const { tabName, dataSet, showType, allTicks, runDates, showMode } = useSelector(
    publicModel.selector,
  );
  return (
    <EchartBox
      style={{ height: 570 }}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: tooltipLinkFormatter, // 联动图表的tooltip格式化显示
        },
        axisPointer: {
          link: [
            {
              xAxisIndex: [0, 1],
            },
          ],
        },
        grid: [
          {
            left: 60,
            top: 80,
            right: 80,
            height: 180,
          },
          {
            left: 60,
            top: 320,
            right: 80,
            height: 180,
          },
        ],
        xAxis: [
          {
            type: 'category',
            data: allTicks ?? [],
            show: false,
            gridIndex: 0,
          },
          {
            type: 'category',
            data: allTicks ?? [],
            gridIndex: 1,
          },
        ],
        yAxis: [
          {
            name: unit ?? 'MW',
            type: 'value',
            scale: true,
            gridIndex: 0,
          },
          {
            name: unit ? `偏差值(${unit})` : '偏差值(MW)',
            type: 'value',
            scale: true,
            gridIndex: 1,
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
        legend: (() => {
          if (!showType) return [];
          const option = {
            itemWidth: 10,
            itemHeight: 3,
          };
          const data = [
            {
              name: `${tabName ?? ''}-${legendText?.[0] ?? '计划'}`,
            },
            {
              name: `${tabName ?? ''}-${legendText?.[1] ?? '实际'}`,
            },
            {
              name: '正偏差',
            },
            {
              name: '负偏差',
            },
          ];
          switch (showType) {
            case '1':
              return { ...option, data: [data[0]] };
            case '2':
              return { ...option, data: [data[1]] };
            default:
              return { ...option, data };
          }
        })(),
        series: ((): any[] => {
          const daArr = [
            {
              type: 'line',
              name: `${tabName ?? ''}-${legendText?.[0] ?? '计划'}`,
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: dataSet?.daData ?? [],
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
          const rtArr = [
            {
              type: 'line',
              name: `${tabName ?? ''}-${legendText?.[1] ?? '实际'}`,
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: dataSet.rtData ?? [],
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
          /** 偏差值 */
          const diffArr: (number | null)[] = colSubrtact(dataSet.rtData, dataSet.daData);
          const diff = [
            {
              type: 'bar',
              name: '正偏差',
              xAxisIndex: 1,
              yAxisIndex: 1,
              color: themeColors[getLocalStorageTheme()]?.['--assist3-color'] ?? '#ED6161',
              data: diffArr.map((num) => {
                if (num === null) return num;
                return num >= 0 ? num : null;
              }),
            },
            {
              type: 'bar',
              name: '负偏差',
              yAxisIndex: 1,
              xAxisIndex: 1,
              color: themeColors[getLocalStorageTheme()]?.['--assist2-color'] ?? '#40B77A',
              data: diffArr.map((num) => {
                if (num === null) return null;
                return num <= 0 ? num : null;
              }),
            },
          ];
          const markLine = getXAxisMarkLineSeries({
            size: showMode === 'LEN_96' ? 96 : 24,
            num: 1,
            rageTimeData: rageTimes([runDates?.[0] as Moment, runDates?.[1] as Moment], YMD),
          });
          if (showType === 'all') {
            return [...daArr, ...rtArr, ...diff, ...markLine];
          }
          if (showType === '1') {
            return [...daArr, ...markLine];
          }
          if (showType === '2') {
            return [...rtArr, ...markLine];
          }
          return [];
        })(),
      }}
      padding={padding}
    />
  );
};

export default Index;
