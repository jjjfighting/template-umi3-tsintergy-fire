/* 用于展示 星期和节假日 */
import { Typography } from 'antd';
import type { Moment } from 'moment';
import type { FC, ReactElement } from 'react';
import React, { memo, useEffect } from 'react';
import { useRequest } from 'umi';
import './index.less';
import { EnHoliday, getHolidayJudge } from './service';

const Index: FC<{
  runDate: Moment | undefined;
  className?: string;
  style?: React.CSSProperties;
}> = ({ runDate, className, style }): ReactElement => {
  const { Text } = Typography;

  // 节假日信息请求
  const { run: runHolidayJudge, data: holiday } = useRequest(getHolidayJudge, {
    manual: true,
  });
  useEffect(() => {
    if (runDate) {
      runHolidayJudge({ startDate: runDate, endDate: runDate });
    }
  }, [runHolidayJudge, runDate]);

  const EnClass = ['assist1Color', 'assist2Color', 'assist2Color', 'primaryColor'];

  return (
    <>
      {holiday && (
        <>
          <Text
            className={`holidayInfo ${className ?? ''} ${
              EnClass[(holiday?.[0]?.dayType ?? 1) - 1]
            }`}
            style={{
              ...style,
            }}
          >
            {EnHoliday[(holiday?.[0]?.dayType ?? 1) - 1]}
          </Text>
        </>
      )}
    </>
  );
};

export default memo(Index);
