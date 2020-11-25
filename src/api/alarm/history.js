import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/noticeLog/search",
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
    url: "/noticeLog/search",
    method: "get",
    params: query
  });
}
// /offlineLog/search search
export function searchTable(query) {
  //离线历史接口表格
  return request({
    url: "/offlineLog/search",
    method: "get",
    params: query
  });
}
// /offlineLog/addRemark addRemark
export function addRemark(query) {
  return request({
    url: "/offlineLog/addRemark",
    method: "post",
    data: qs.stringify(query)
  });
}
