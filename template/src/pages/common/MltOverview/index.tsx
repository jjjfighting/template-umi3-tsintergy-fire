// 禅道
import Page from '@/components/Page';
import { memo } from 'react';
import { useLogic } from './logic';

interface Props {
  system: systemType;
}

const Index = (props: Props) => {
  const logic = useLogic();

  return <Page>MltOverview</Page>;
};

export default memo(Index);
