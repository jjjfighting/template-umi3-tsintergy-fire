/* eslint-disable no-console */
import { GlobalOutlined } from '@ant-design/icons';
import { changeTheme, getLocalStorageTheme } from '@tsintergy/ppss';
import { message, notification } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import { history } from 'umi';

export const errorHandle = (error: Error) => {
  console.error('[debug]: getInitialState -> error', error);
  if (!window.location.href.includes('/Exception')) {
    history.push(`/Exception/InitException`);
  }
};

// 错误通知防抖
let errorTime: Moment;
const messageDebounce = (message: string) => {
  const diffTime = errorTime ? moment().diff(errorTime) : errorTime;
  if (!errorTime || diffTime > 1000) {
    notification.error({
      message,
      icon: <GlobalOutlined style={{ color: '#f5222d' }} />,
    });
    errorTime = moment();
  }
};

// 用户中心cas的错误通知
export const casErrorHandler = (error: any) => {
  if (error?.data?.retCode === 'T100_soft') {
    // 软提示, no throw error
    message.warning(error?.data?.retMsg);
    return null;
  }
  if (error?.data?.retCode === 'T302') {
    messageDebounce(error?.data?.retMsg || '登录超时');
    // 开发模式
    if (process.env.NODE_ENV === 'development') {
      history.push(`/Login`);
      throw error;
    }
    if (error?.data?.data?.redirectUrl) {
      window.location.href = `${error?.data?.data?.redirectUrl}`;
    }
    throw error;
  }
  if (error?.data?.retCode === 'T403') {
    if (error?.data?.data?.redirectUrl) {
      window.location.href = `${error?.data?.data?.redirectUrl}`;
    }
    throw error;
  }
  if (error.name === 'HttpError') {
    messageDebounce(error.message);
    throw error;
  }
  if (error?.data?.retMsg) {
    messageDebounce(error?.data?.retMsg);
  }
  throw error;
};

// 设置主题
const setPrimaryColor = async () => {
  const publicPath = process.env.NODE_ENV === 'development' ? '' : `${API_PREFIX}`; // 项目的publicPath，没有配置的可以置空
  const lessConfigNode = document.createElement('script');
  const lessScriptNode = document.createElement('script');
  const lessStyleNode = document.createElement('link');
  lessStyleNode.setAttribute('rel', 'stylesheet/less');
  lessStyleNode.setAttribute('id', 'link:less-style-node');
  lessStyleNode.setAttribute('href', `${publicPath}/less/color.less`);

  lessConfigNode.innerHTML = `
      less = {
        async: true,
        env: 'development',
      };
    `;
  lessConfigNode.setAttribute('id', 'script:less-config-node');
  lessScriptNode.src = `${publicPath}/less/less.min.js`;
  lessScriptNode.async = true;
  lessScriptNode.setAttribute('id', 'script:less-script-node');

  const link = document.getElementById('link:less-style-node');
  const config = document.getElementById('script:less-config-node');
  const script = document.getElementById('script:less-script-node');
  // 引入顺序不能改变.
  await (!link && document.body.appendChild(lessStyleNode));
  await (!config && document.body.appendChild(lessConfigNode));
  await (!script && document.body.appendChild(lessScriptNode));
};

export const setTheme = async (myTheme?: string) => {
  const theme: any = getLocalStorageTheme();
  await setPrimaryColor();
  // 优先使用缓存, 然后是传参
  changeTheme(theme || myTheme);
};
