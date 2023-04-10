import { useRequest } from 'umi';
import { getHolidayJudge, EnHoliday } from './service';
import type { Moment } from 'moment';
import { useEffect } from 'react';

export default (runDate: Moment) => {
  const { run: runHolidayJudge, data: holiday } = useRequest(getHolidayJudge, {
    manual: true,
  });

  useEffect(() => {
    if (runDate) {
      runHolidayJudge({ startDate: runDate, endDate: runDate });
    }
  }, [runHolidayJudge, runDate]);

  return holiday ? EnHoliday[(holiday?.[0]?.dayType ?? 1) - 1] : '';
};
