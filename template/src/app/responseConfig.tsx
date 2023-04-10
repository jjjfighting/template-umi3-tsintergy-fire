import { ApiOutlined, GlobalOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import moment from 'moment';
import type { RequestConfig } from 'umi';
import { ErrorShowType, history } from 'umi';
import { IEVersion } from '../utils/url';

const codeMessage: any = {
  // 200: '服务器成功返回请求的数据。',
  // 201: '新建或修改数据成功。',
  // 202: '一个请求已经进入后台排队（异步任务）。',
  // 204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '禁止访问。',
  404: '资源不存在。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const request: RequestConfig = {
  // ! 一般应该直接复制 yApi 中的接口地址，所以这里不配置全局 prefix
  // ! 当前缀需要与项目动态一致时，才需要特别配置 prefix 为 API_PREFIX
  params: {
    _t: IEVersion() === -1 ? undefined : moment().format('X'), // ie浏览器 加时间戳 放置get请求缓存bug
  },
  headers: {
    'Cache-Control': 'no-store',
    Pragma: 'no-store',
  },
  validateCache: () => false, // 关闭get请求缓存，ie11登录死循环问题

  // 1.设置一层拦截，把没有场站ID 的请求拦截下来，并为他们添加上场站ID，
  // 2.然后没有不存在场站ID，提示用户需要维护一个场站ID， 并跳转基础信息页面
  // requestInterceptors: interceptorsFun(),
  responseInterceptors: [
    (response: any) => {
      const { ok, status } = response;
      if (ok && status === 200) {
        return response;
      }
      const error = Error(`${status} ${codeMessage[status]}`);
      error.name = 'HttpError';
      throw error;
    },
  ],
  errorConfig: {
    adaptor: (res: any) => {
      return {
        // 服务器处理正常 || 是地图json
        success: res?.retCode === 'T200' || res?.type === 'FeatureCollection',
        data: res?.data,
        errorCode: res?.retCode,
        errorMessage: res?.retMsg,
        showType: ErrorShowType.SILENT,
      };
    },
  },
  errorHandler: (error: any) => {
    console.error('error-network', error);
    const style = { color: '#f5222d' };
    if (error?.data?.retMsg === '登录超时') {
      history.push(`/Login`);
      return;
    }
    if (error.name === 'HttpError') {
      notification.error({
        key: 'error',
        message: error.message,
        // description: error.message,
        icon: <GlobalOutlined style={style} />,
      });
    } else {
      notification.error({
        key: 'error',
        message: error.message,
        // description: error.message,
        icon: <ApiOutlined style={style} />,
      });
      if (error?.data?.retMsg === '操作失败' && ACTIVEAUTH) {
        // 比如申报推荐里面的算法没有状态码 而且要开启权限校验
        history.push('/Exception/403');
        return;
      }
      if (error?.data?.retMsg === '登录超时') {
        history.push(`/Login`);
        return;
      }
      if (error?.data?.retCode === 'T000') {
        history.push('/Exception/403');
        return;
      }
    }
    throw error;
  },
};

export default request;
