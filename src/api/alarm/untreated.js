import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/warning/search",
    method: "get",
    params: query
  });
}

export function fetchHost() {
  return request({
    url: "/host/list",
    method: "get"
  });
}

export function fetchChannel(query) {
  return request({
    url: "/channel/findByHost",
    method: "get",
    params: query
  });
}

export function fetchNode(query) {
  return request({
    url: "/node/findByChannel",
    method: "get",
    params: query
  });
}

export function search(query) {
  return request({
    url: "/untreated/search",
    method: "get",
    params: query
  });
}

export function handleStart(data) {
  return request({
    url: "/warningReport/start/" + data,
    method: "put"
  });
}

export function handleFinish(data) {
  return request({
    url: "/warningReport/finish/" + data,
    method: "put"
  });
}

export function reportData(query) {
  return request({
    url: "/warningReport/report",
    method: "post",
    data: qs.stringify(query)
  });
}

export function fetchDict(data) {
  return request({
    url: "/dict/getByKey/" + data,
    method: "get"
  });
}

export function getWorkFlowDict(query) {
  return request({
    url: "/workflow/getByKey",
    method: "get",
    params: {
      key: query
    }
  });
}
export function getAnalysis() {
  return request({
    url: "/untreated/getAnalysis",
    method: "get"
  });
}

export function getWorkFlow(status, key) {
  const list = JSON.parse(localStorage.getItem("workflow"));
  var d_name;
  for (var i = 0; i < list.length; i++) {
    if (list[i].value == status && list[i].key == key) {
      d_name = list[i].name;
    }
  }
  return d_name;
}

export function check(warningId) {
  return request({
    url: "/warning/getReport",
    method: "get",
    params: {
      warningId
    }
  });
}

export function detailsWarning(warningId) {
  return request({
    url: "/warning/details",
    method: "get",
    params: {
      warningId
    }
  });
}

// /warning/handle

export function handleWarning(query) {
  return request({
    url: "/warning/handle",
    method: "get",
    params: query
  });
}

//  获取报警类型列表
export function findWarningType() {
  return request({
    url: "/warning/findWarningType",
    method: "get"
  });
}
