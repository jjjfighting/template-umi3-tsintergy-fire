import { request } from 'umi';

// 获取用户系统消息
export function getUserAppNews(url: string, params: { appId: string; userId: string }) {
  return request(url, {
    params,
    skipErrorHandler: true,
  });
}

// 标记用户已读
export function markReceive(url: string, params: { topicId: string; userId: string }) {
  return request(url, {
    params,
    skipErrorHandler: true,
  });
}
