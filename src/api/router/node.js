import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/node/findByPage",
    method: "get",
    params: query
  });
}

export function fetchProvince() {
  return request({
    url: "/province/getAll",
    method: "get"
  });
}

export function fetchCity(query) {
  return request({
    url: "/city/getByProvinceCode",
    method: "get",
    params: {
      code: query
    }
  });
}

export function fetchCounty(query) {
  return request({
    url: "/county/getByCityCode",
    method: "get",
    params: {
      code: query
    }
  });
}

export function fetchAllHost() {
  return request({
    url: "/host/list",
    method: "get"
  });
}

export function fetchAllChannel() {
  return request({
    url: "/channel/list",
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

export function createNode(data) {
  return request({
    url: "/node/create",
    method: "post",
    data: qs.stringify(data)
  });
}

export function updateNode(data) {
  return request({
    url: "/node/update",
    method: "put",
    data: qs.stringify(data)
  });
}

// /node/delete
export function deleteNode(id) {
  return request({
    url: "/node/delete",
    method: "put",
    data: qs.stringify({
      id
    })
  });
}

export function search(query) {
  return request({
    url: "/node/search",
    method: "get",
    params: query
  });
}

export function fetchDict(data) {
  return request({
    url: "/dict/getByKey/" + data,
    method: "get"
  });
}

// /channel/findList 获取通道列表（级联查询）
export function findListchannel(hostId) {
  return request({
    url: "/channel/findList",
    method: "get",
    params: {
      hostId
    }
  });
}
// /file/exportExcel
export function exportExcel() {
  return request({
    url: "/file/exportExcel",
    method: "get",
    responseType: "blob"
  });
}
// /file/exportPdf
export function exportPdf() {
  return request({
    url: "/file/exportPdf",
    method: "get",
    responseType: "blob"
  });
}

// 根据节点id获取节点所属信息
export function findNodeData(id) {
  return request({
    url: "/node/findNodeData",
    method: "get",
    params: {
      id
    }
  });
}
