---
title: "封装Axios"
createdAt: "2025-12-04T10:30:00"
updatedAt: "2025-12-11T14:20:00"
---

# 合理拆分并封装Axios

## React+Ts（图床小项目）

### 创建实例

创建实例方法、```Axios```实例、拦截器

```typescript
import axios, { AxiosInstance,AxiosResponse,AxiosError } from 'axios';
export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'http://127.0.0.1:7500/api',
    timeout: 10000,
  });

  // 请求拦截器
  api.interceptors.request.use(
      (config) => {
          const token = localStorage.getItem('auth_token'); // '000000'
          if (token) {
              config.headers.token = `${token}`; 
          }
          return config;
      },
      (error: AxiosError) => {
          alert('请求发送失败，请稍后重试');
          return Promise.reject(error);
      }
  );
  
  // 响应拦截器
  api.interceptors.response.use(
      (response: AxiosResponse) => {
          return response;
      },
      (error) => {
          // const {response} = error;
          if (JSON.stringify(error).includes('Network Error')){
              alert('网络连接异常，请检查您的网络设置');
          }
          // 根据响应的错误状态码，做不同的处理，此处只是作为示例，请根据实际业务处理
          // if (response) {
          //     if (response === 400) {
                  
          //     } else if (response === 401) {
                  
          //     } else {
                  
          //     }
          // }
          
          return Promise.reject(error);
      }
  );
  return api;
};
// 导出默认的 api 实例
const api = createApiClient();
export default api;

```

### 错误处理

处理错误部分可以单独分出来一个文件，下面给出一个示例，只做展示逻辑用。

```javascript
import Taro from '@tarojs/taro';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  426: '用户名或密码不正确。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
export function handleError(response) {
  const { status:code,data } = response;
  if (code === 401) {
    Taro.showToast({
      title: `请求错误：${codeMessage[code]}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
  }
  if (code === 403) {
    Taro.showToast({
      title: `请求错误：${codeMessage[code]}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
  }
  if (code <= 504 && code >= 500) {
    Taro.showToast({
      title: `请求错误：${codeMessage[code]}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
  }
  if (code >= 404 && code < 422) {
    Taro.showToast({
      title: `请求错误：${codeMessage[code]}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
  }
  if (code === 426) {
    Taro.showToast({
      title: `请求错误 ${response.status} ${response.data.msg}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
    return response.status;
  }
  if (code === 428) {
    Taro.showToast({
      title: `请求错误 ${response.status} ${response.data.msg}`,
      duration: 2000,
      mask: true,
      icon: 'none'
    })
    return response.status;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  Taro.showToast({
    title: `请求错误 ${response.status} ${errortext}`,
    duration: 2000,
    mask: true,
    icon: 'none'
  })
  return data;
}

```

### 响应类型

```typescript
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export interface UploadResponseData {
  filename: string;
  originName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadTime: number;
}

export interface GetImagesResponseData {
  filename: string;
  path: string;
  size: number;
  uploadTime: number;
  url: string;
}

export interface DeleteImageResponse {
  path: string;
  success: boolean;
  error?: string;
}

export interface ConfigData {
  fileSize: number;
  maxUploadCount: number;
  token: string;
}

```

### API请求

可以把基本方法封装一下（get、post等）

```typescript
export const imageApi = {
  upload: async (files: File[]): Promise<UploadResponseData[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post<ApiResponse<UploadResponseData[]>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data ?? [];
  },
  ....
};

```

### 统一导出调用

```typescript
// 导出类型
export * from '../types/api';

// 导出服务
export { imageApi } from '../services/imageApi';

// 导出 api 实例
export { createApiClient } from '../services/apiClient';
export { default as apiClient } from '../services/apiClient';

```







# 参考链接

[React + TS 项目封装axios全过程 | 三棵杨树](https://sankeyangshu.top/posts/react-axios.html)

[Multipart 实体请求 | Axios中文文档 | Axios中文网](https://www.axios-http.cn/docs/multipart)
