import Page from '@/components/Page';
import useInitialState from '@/hooks/useInitialState';
import type { RouteProps } from '@/types';
import { useBoolean } from 'ahooks';
import qs from 'qs';
import React from 'react';
import { History, Location } from 'umi';
import './index.less';

const iframeStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: '5px',
};

const Index: React.FC<RouteProps> = (props) => {
  const [state, { setFalse }] = useBoolean(true);
  const { access } = useInitialState();

  const fixUrl = (location: Location<History.PoorMansUnknown> & { query: any }) => {
    const { query, pathname } = location;
    const result = access[`${pathname}`];

    if (result) {
      const [_, urlParams] = result.path?.split('?');
      const urlParamsParse = qs.parse(urlParams);
      const { url } = urlParamsParse ?? {};
      if (url) return url;
    }

    const { url } = query;
    console.log('🚀 ~ file: index.tsx ~ line 17 ~ fixUrl ~ url', url);
    if (!url) {
      return '';
    }

    if (!url.includes('http://') && !url.includes('https://')) {
      return `http://${url}`;
    }
    console.log('fixUrl -> url', url);
    return url;
  };

  return (
    <Page pageContentClassName="pageContentClassName" loading={state}>
      <iframe
        title={props?.route?.title}
        src={`${fixUrl(props?.location)}`}
        style={iframeStyle}
        onLoad={setFalse}
      />
    </Page>
  );
};

export default Index;
