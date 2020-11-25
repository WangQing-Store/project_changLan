import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";

import "@/icons"; // icon
import "@/permission"; // permission control

import VueAMap from "vue-amap";
import axios from "axios";
Vue.prototype.$axios = axios;
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
import ECharts from "vue-echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";

Vue.component("v-chart", ECharts);

Vue.filter("filterTime", function(time) {
  if (time == null) return "当前时刻";
  // var date = new Date(time)
  // return formatDate(date, 'yyyy-MM-dd hh:mm')
  let d = new Date(time);
  if (d.getHours() < 10) {
    var Hours = "0" + d.getHours();
  } else {
    var Hours = d.getHours();
  }
  if (d.getMinutes() < 10) {
    var Minutes = "0" + d.getMinutes();
  } else {
    var Minutes = d.getMinutes();
  }
  if (d.getSeconds() < 10) {
    var Seconds = "0" + d.getSeconds();
  } else {
    var Seconds = d.getSeconds();
  }
  let installtime =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    "   " +
    Hours +
    ":" +
    Minutes +
    ":" +
    Seconds;
  return installtime;
});

Vue.use(ElementUI, {
  locale: locale, // 国际编码
  size: "small" // element-ui默认大小
});
Vue.use(VueAMap);

//系统错误捕获
const errorHandler = (error, vm) => {
  // console.error("抛出全局异常");
  // console.error(vm);
  console.error(error);
};
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = error => errorHandler(error, this);

Vue.config.productionTip = false;

VueAMap.initAMapApiLoader({
  // 高德key
  key: "e6a4acbaf9e1978f28adabc0af51163d",
  // 插件集合 （插件按需引入）
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.PolyEditor",
    "AMap.CircleEditor",
    "AMap.Geocoder",
    "AMap.Geolocation",
    "AMap.CitySearch"
  ],
  uiVersion: "1.0",
  v: "1.4.4"
});
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
