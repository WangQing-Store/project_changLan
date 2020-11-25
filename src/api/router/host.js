import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/host/search",
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

export function search(query) {
  return request({
    url: "/host/search",
    method: "get",
    params: query
  });
}

export function findHost(query) {
  return request({
    url: "/host/getByCode",
    method: "get",
    params: {
      code: query
    }
  });
}

export function fetchHost(query) {
  return request({
    url: "/host/findById",
    method: "get",
    params: {
      id: query
    }
  });
}

// /host/findByPage 分页获取主机列表
export function findByPage(query) {
  return request({
    url: "/host/findByPage",
    method: "get",
    params: query
  });
}

// /host/update 编辑主机信息
export function updateHost(query) {
  return request({
    url: "/host/update",
    method: "put",
    data: qs.stringify(query)
  });
}
// /host/delete  删除主机信息
export function deleteHost(id) {
  return request({
    url: "/host/delete",
    method: "put",
    data: qs.stringify({
      id
    })
  });
}
// /host/create 新增主机信息
export function createHost(query) {
  return request({
    url: "/host/create",
    method: "post",
    data: qs.stringify(query)
  });
}
// 根据编号查找主机（判断主机唯一）
export function findByUid(uid) {
  return request({
    url: "/host/findByUid",
    method: "get",
    params: {
      uid
    }
  });
}
export function findHostType() {
  return request({
    url: "/host/findHostType",
    method: "get"
  });
}

// 根据主机id删除该主机下数据信息
export function findHostData(id) {
  return request({
    url: "/host/findHostData",
    method: "get",
    params: {
      id
    }
  });
}
