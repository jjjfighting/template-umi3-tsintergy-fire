/** 阻塞信息: 独立代码 */
import CardWrapper from '@/components/CardWrapper';
import { marginGap } from '@/utils/constant';
import { getXAxisMarkLineSeries } from '@/utils/eChartUtils';
import { rageTimes } from '@/utils/timeUtils';
import { MegaChart, tooltipLinkFormatter, YMD } from '@tsintergy/ppss';
import { useMount } from 'ahooks';
import { Col, DatePicker, Row, Table } from 'antd';
import type { Moment } from 'moment';
import { useSelector } from 'umi';
import { showTypeEnum } from '../../../config';
import { publicModel } from '../../../model';
import type { IShowType } from '../../types';
import { getColumns } from './config';
import { useReqAid } from './hooks';
import SelectBox from './SelectBox';
import { useCallback } from 'react';

const Index = () => {
  useMount(() => {
    publicModel.actions.update({
      showType: showTypeEnum?.[0]?.value as IShowType | undefined,
    });
  });

  const { runDates, runDate, showType, showMode } = useSelector(publicModel.selector);
  const [{ blockItem, loading }, { setBlockName }] = useReqAid();

  const handleSelect = useCallback(
    (item) => {
      setBlockName(item?.id);
    },
    [setBlockName],
  );

  return (
    <Row wrap={false}>
      {!!blockItem?.blockEnum?.length && (
        <Col flex="none">
          <SelectBox
            onClick={handleSelect}
            getFirstNodeProp={handleSelect}
            style={{ height: 'calc(100vh - 300px)', overflowY: 'hidden' }}
            optionList={blockItem?.blockEnum}
          />
        </Col>
      )}
      <Col flex="auto">
        <CardWrapper
          noPadding
          style={{ marginTop: marginGap, marginLeft: blockItem?.blockEnum?.length ? 8 : 24 }}
          loading={loading}
        >
          <MegaChart
            optionOpts={{ notMerge: true }}
            option={
              {
                xAxis: {
                  type: 'category',
                  data: blockItem.ticks ?? [],
                },
                yAxis: {
                  type: 'value',
                  scale: true,
                  name: 'MW',
                },
                tooltip: {
                  formatter: tooltipLinkFormatter,
                },
                series: (() => {
                  const daData = [
                    {
                      type: 'line',
                      name: '正向极限-计划',
                      data: blockItem?.daPosLimitArr,
                    },
                    {
                      type: 'line',
                      name: '负向极限-计划',
                      data: blockItem.daNegLimitArr,
                    },
                  ];
                  const rtData = [
                    {
                      type: 'line',
                      name: '正向极限-实际',
                      data: blockItem.rtPosLimitArr,
                    },
                    {
                      type: 'line',
                      name: '负向极限-实际',
                      data: blockItem.rtNegLimitArr,
                    },
                  ];
                  const markLine = getXAxisMarkLineSeries({
                    size: showMode === 'LEN_96' ? 96 : 24,
                    num: 1,
                    rageTimeData: rageTimes(
                      [runDates?.[0] as Moment, runDates?.[1] as Moment],
                      YMD,
                    ),
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
                })(),
              } as echarts.EChartsOption
            }
          />

          <Row
            justify="space-between"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: marginGap,
            }}
          >
            <DatePicker
              allowClear={false}
              value={runDate}
              disabledDate={(currentDate) => {
                return !currentDate?.isBetween(runDates?.[0], runDates?.[1], 'day', '[]');
              }}
              onChange={(val) => {
                if (val) publicModel.actions.update({ runDate: val });
              }}
            />
            <span>单位: MW</span>
          </Row>
          <Table
            bordered
            rowKey="tick"
            pagination={false}
            scroll={{ x: 'max-content', y: 260 }}
            columns={getColumns(showType)}
            dataSource={blockItem.dataSource}
          />
        </CardWrapper>
      </Col>
    </Row>
  );
};

export default Index;
