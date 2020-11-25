import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/unit/findByPage",
    method: "get",
    params: query
  });
}

export function search(query) {
  return request({
    url: "/unit/search",
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

export function createUnit(data) {
  return request({
    url: "/unit/create",
    method: "post",
    data: qs.stringify(data)
  });
}

export function updateUnit(data) {
  return request({
    url: "/unit/update",
    method: "put",
    data: qs.stringify(data)
  });
}

export function deleteUnit(id) {
  return request({
    url: "/unit/delete",
    method: "put",
    data: qs.stringify({
      id
    })
  });
}

export function fetchInfo() {
  return request({
    url: "/unit/getUnitInfo",
    method: "get"
  });
}

export function findHostNode(unitId) {
  return request({
    url: "/unitNode/findHostNode",
    method: "get",
    params: {
      unitId
    }
  });
}
export function setDataunitNode(query) {
  return request({
    url: "/unitNode/setData",
    method: "post",
    data: qs.stringify(query)
  });
}
