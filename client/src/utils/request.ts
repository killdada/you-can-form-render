/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
// import { clearToken } from '@/utils/auth';

const noAuthCode = 4396;
const codeMessage = {
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
type mapCode = 401 | 403 | 404 | 406 | 410 | 422 | 500 | 502 | 503 | 504;

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response?.status) {
    const errorText = codeMessage[response.status as mapCode] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    throw new Error('您的网络发生异常，无法连接服务');
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  prefix: process.env.REACT_APP_DOMAIN || '',
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// 克隆响应对象做解析处理
request.interceptors.response.use(async (response: Response) => {
  const data: any = await response.clone().json();
  if (data && data.status === noAuthCode) {
    // clearToken();
    // window.location.replace(data.msg);
  }
  return data;
});

export default request;
