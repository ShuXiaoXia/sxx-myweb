import axios from "axios";

// 创建 axios 实例
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // 可以从环境变量获取
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
httpRequest.interceptors.request.use(
  (config) => {
    // 从 localStorage 或 store 获取 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
httpRequest.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          console.error("Unauthorized");
          // 可以在这里触发登出逻辑
          break;
        case 403:
          // 处理禁止访问
          console.error("Forbidden");
          break;
        case 404:
          // 处理未找到
          console.error("Not Found");
          break;
        case 500:
          // 处理服务器错误
          console.error("Server Error");
          break;
        default:
          console.error("Unknown Error");
      }
    }
    return Promise.reject(error);
  },
);

// 封装常用 HTTP 方法
export default {
  get(url, params = {}, config = {}) {
    return httpRequest.get(url, { ...config, params });
  },
  post(url, data = {}, config = {}) {
    return httpRequest.post(url, data, config);
  },
  put(url, data = {}, config = {}) {
    return httpRequest.put(url, data, config);
  },
  delete(url, config = {}) {
    return httpRequest.delete(url, config);
  },
  patch(url, data = {}, config = {}) {
    return httpRequest.patch(url, data, config);
  },
};
