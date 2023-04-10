/** 输变电检修信息 */
import CardWrapper from '@/components/CardWrapper';
import Page from '@/components/Page';
import PageTable from '@/components/PageTable';
import useInitialState from '@/hooks/useInitialState';
import { marginGap } from '@/utils/constant';
import { YMDHms } from '@/utils/timeUtils';
import { YMD } from '@tsintergy/ppss';
import { useMount, useUnmount } from 'ahooks';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useRequest, useSelector } from 'umi';
import { getTimeText } from '../config';
import { publicModel } from '../model';
import Condition from './Condition';
import { getColumns } from './config';
import { getOverhaul } from './service';

const Index = () => {
  const [deviceName, setDeviceName] = useState<string | undefined>();
  const {
    sysParameter: { systemProvinceAreaId },
  } = useInitialState();
  const { showType, runDates } = useSelector(publicModel.selector);

  // 初始化名称
  useMount(() => {
    publicModel.actions.update({
      tabName: '输变电检修信息',
    });
  });
  // 离开时重置数据, 但是日期公用不重置
  useUnmount(() => {
    publicModel.actions.update({
      showMode: 'LEN_96',
      updateTime: null,
      tabName: undefined,
      dataSourceOne: undefined,
      dataSourceAll: undefined,
      columns: [],
      dataSet: {},
    });
  });

  const { run, loading, data } = useRequest(getOverhaul, {
    manual: true,
  });

  useEffect(() => {
    run({
      startDate: runDates?.[0],
      endDate: runDates?.[1],
      provinceAreaId: systemProvinceAreaId,
      deviceName,
    });
  }, [deviceName, run, runDates, systemProvinceAreaId]);

  const [filtedData, timeText] = useMemo(() => {
    const updateDate = runDates?.[1]?.format(YMD);
    let updateTime;

    // 按照展示筛选数据
    const list = data
      ?.filter(({ dataType }) => showType === dataType)
      ?.map((item, index) => {
        const { date, dataType, deviceType, startTime, endTime } = item;
        // 查找更新时间
        if (updateDate && date && item.date?.split(' ')[0] === updateDate) {
          updateTime = item?.updateTime;
        }

        return {
          ...item,
          order: index + 1,
          date: date?.split(' ')?.[0],
          startTime: moment(startTime).format(YMDHms),
          endTime: moment(endTime).format(YMDHms),
          key: `${dataType}_${date}_${item.deviceName}_${deviceType}_${startTime}_${endTime}`, // 唯一key
          property: item?.dataType === '1' ? '计划' : '实际',
        };
      });

    return [list, getTimeText(updateDate, updateTime)];
  }, [data, runDates, showType]);

  return (
    <Page loading={loading}>
      <Condition
        timeText={timeText}
        deviceName={deviceName}
        setDeviceName={setDeviceName}
        filtedData={filtedData}
      />

      <CardWrapper shadow style={{ marginTop: marginGap }}>
        <PageTable
          scroll={{ y: 600 }}
          rowKey="key"
          pagination={false}
          columns={getColumns()}
          dataSource={filtedData}
        />
      </CardWrapper>
    </Page>
  );
};

export default Index;
