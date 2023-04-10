/**
 * 全网负荷信息
 * https://lanhuapp.com/web/#/item/project/product?tid=eaf98ed9-ef9b-4d7a-914a-0000943413e4&pid=db42e075-ff8f-4181-9617-d0411b347fa2&versionId=5d841f99-59cb-4814-acbb-b5d7cd7627d1&docId=a09cbcab-09b1-4b70-8f47-cf1b9db2701b&docType=axure&pageId=c20602ccbc624d17b0b21e8de0601d50&image_id=a09cbcab-09b1-4b70-8f47-cf1b9db2701b&parentId=a2421ca5-479f-48f7-8553-624a54c63ad8
 */

import Page from '@/components/Page';
import PayloadCondition from './components/PayloadCondition';
import { useCallback, useMemo, useState } from 'react';
import loadable from '@loadable/component';
import CardWrapper from '@/components/CardWrapper';
import { marginGap } from '@/utils/constant';
import RadioTabs from '@/components/RadioTabs';
import { useSelector } from 'react-redux';
import { publicModel } from '../model';
import type { ITabRadioItemType } from '@/components/RadioTabs/types';
import { payloadMenuEnum } from '../config';
import { cloneDeep } from 'lodash';

// 动态组件，根据tab动态加载组件
const DynamicComp = loadable(
  ({ compType }: { compType: string }) => import(`./components/${compType}`),
  {
    cacheKey: ({ compType }: { compType: string }) => compType,
    fallback: <div />,
  },
);

const Index = () => {
  const [compType, setCompType] = useState<string>('BidSpace');
  const { tabName, channelEnum } = useSelector(publicModel.selector);

  const onRadioValueChange = useCallback(
    (key: string) => {
      if (!key) return;
      // 如果不是联络线信息渠道项则切换组件
      if (channelEnum?.find(({ value }) => value === key)) {
        publicModel.actions.update({
          tabName: channelEnum?.find(({ value }) => value === key)?.label,
        });
        setCompType('ElePayload');
        return;
      }
      publicModel.actions.update({
        tabName: payloadMenuEnum?.find(({ value }) => value === key)?.label,
      });
      setCompType(key);
    },
    [channelEnum],
  );

  const menuList = useMemo(() => {
    const shadow = cloneDeep(payloadMenuEnum);
    if (!channelEnum?.length) {
      shadow[3].children = [];
    }
    if (channelEnum?.length) {
      shadow[3].children = [
        { label: shadow?.[3]?.label, value: shadow?.[3]?.value },
        ...channelEnum,
      ];
    }

    return shadow;
  }, [channelEnum]);

  return (
    <Page>
      <PayloadCondition selfShowTypeEnum={null} />

      <CardWrapper
        shadow
        cardHeadTitleStyle={{ overflow: 'hidden' }}
        bodyStyle={{
          paddingTop: 0,
          paddingLeft:
            compType === payloadMenuEnum[payloadMenuEnum?.length - 1].value ? 0 : undefined,
        }}
        style={{ marginTop: marginGap }}
        title={
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <RadioTabs
              value={
                (channelEnum?.find(({ label }) => label === tabName)
                  ? channelEnum?.find(({ label }) => label === tabName)?.value
                  : menuList?.find(({ label }) => label === tabName)?.value) as string
              }
              dataSource={menuList as ITabRadioItemType}
              onChange={onRadioValueChange}
            />
          </div>
        }
      >
        {compType && <DynamicComp compType={compType} />}
      </CardWrapper>
    </Page>
  );
};

export default Index;
