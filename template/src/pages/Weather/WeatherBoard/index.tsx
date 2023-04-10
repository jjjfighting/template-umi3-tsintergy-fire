import type { RouteProps } from '@/types';
import React from 'react';
import { useSelector } from 'umi';
import { WeatherIframe } from '@tsintergy/ppss';
import { commomModel } from '@/models/commonModel';
import useSysParameter from '@/hooks/useSysParameter';
import useInitialState from '@/hooks/useInitialState';

const Index: React.FC<RouteProps> = (props) => {
  const { themeChangeTag } = useSelector(commomModel.selector);
  const { systemProvinceAreaId } = useSysParameter();
  const initialState = useInitialState();

  return (
    <>
      {!IS_HUANENG && (
        <WeatherIframe
          // 开发环境下需要的weather启动的端口
          port={'8000'}
          // 主题变化
          themeChangeTag={themeChangeTag}
          // getInitialState 返回的 系统信息 可以在useInitialState 获取
          initialState={initialState}
          // 省份区域id
          systemProvinceAreaId={systemProvinceAreaId}
          // 分公司列表
          nameList={[initialState?.userInfo?.tenantName ?? '']}
        />
      )}
    </>
  );
};

export default Index;
