import { useRequest } from 'umi';
import * as services from './service';

export const useLogic = () => {
  const {
    data: xxxData,
    loading: xxxLoading,
    run: xxxRun,
  } = useRequest(services.xxx, {
    manual: true,
  });

  return {};
};
