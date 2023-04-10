import type { FC } from 'react';
import { getUserAppNews, markReceive } from './service';
import useSysParameter from '@/hooks/useSysParameter';
import type { IMessageNoticeRefAPI } from '@tsintergy/ppss';
import { MessageNotice } from '@tsintergy/ppss';
import { useRef } from 'react';
import { useMount } from 'ahooks';
import { useRequest, useSelector } from 'umi';
import { commomModel } from '@/models/commonModel';
import useInitialState from '@/hooks/useInitialState';

const Index: FC = () => {
  const {
    userInfo: { applicationId, userId },
  } = useInitialState();
  const { getMessageUrl, receiveMessageUrl } = useSysParameter();
  const messageNoticeRef = useRef<IMessageNoticeRefAPI>(null);
  const { themeChangeTag } = useSelector(commomModel.selector);

  // 获取消息内容
  const { run } = useRequest(getUserAppNews, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        messageNoticeRef.current?.showNotice(res);
      }
    },
  });

  // 标记已读消息
  const { run: receiveRun } = useRequest(markReceive, {
    manual: true,
  });

  useMount(() => {
    if (applicationId && userId && getMessageUrl) {
      run(getMessageUrl, {
        appId: applicationId,
        userId,
      });
    }
  });
  return (
    <MessageNotice
      themeChangeTag={themeChangeTag}
      ref={messageNoticeRef}
      onRead={(id) => {
        // 确认已读
        if (receiveMessageUrl) {
          receiveRun(receiveMessageUrl, { topicId: id, userId: userId! });
        }
      }}
    />
  );
};

export default Index;
