import axios from "axios";
import { Message } from "element-ui";
import store from "../store";
import { getToken, removeToken, setToken } from "@/utils/auth";
import router from "@/router";
// 创建axios实例
// console.log(process.env.BASE_API)
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // 请求超时时间
});

// 正在进行中的请求列表
let reqList = [];

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function(reqList, url, cancel, errorMessage) {
  const errorMsg = errorMessage || "";
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function(reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1);
      break;
    }
  }
};

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    let cancel;
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function(c) {
      cancel = c;
    });
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url, cancel);

    return config;
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    setTimeout(() => {
      allowRequest(reqList, response.config.url);
    }, 0);
    // console.log(response.data)
    if (response.data.code === 401) {
      removeToken();
      localStorage.removeItem("ExpirationTime");
      // resolve()
      router.replace({
        path: "/login"
      });
    }
    return response;
  },
  error => {
    // console.log("err" + error); // for debug
    if (error.message) {
      Message({
        message: error.message,
        type: "error",
        duration: 10 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
