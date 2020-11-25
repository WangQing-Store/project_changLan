import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/channel/findByPage",
    method: "get",
    params: query
  });
}

export function fetchHosts() {
  return request({
    url: "/host/list",
    method: "get"
  });
}
// /channel/update
export function updateChannel(data) {
  return request({
    url: "/channel/update",
    method: "put",
    data: qs.stringify(data)
  });
}

export function deleteChannel(id) {
  return request({
    url: "/channel/delete",
    method: "put",
    data: qs.stringify({
      id
    })
  });
}

export function search(query) {
  return request({
    url: "/channel/search",
    method: "get",
    params: query
  });
}

export function updateDisarm(id) {
  return request({
    url: "/channel/setDisarm",
    method: "put",
    data: qs.stringify({
      id
    })
  });
}

export function fetchDict(data) {
  return request({
    url: "/dict/getByKey/" + data,
    method: "get"
  });
}

export function getByValueAndKey(value, key) {
  return request({
    url: "/dict/getByValueAndKey",
    method: "get",
    params: {
      value: value,
      key: key
    }
  });
}

export function findChannel(code, hid) {
  return request({
    url: "/channel/getByCode",
    method: "get",
    params: {
      code: code,
      hostId: hid
    }
  });
}

export function fetchChannel(query) {
  return request({
    url: "/channel/findById",
    method: "get",
    params: {
      id: query
    }
  });
}
// /host/findList
export function findList() {
  return request({
    url: "/host/findList",
    method: "get"
  });
}
export function createChannel(query) {
  return request({
    url: "/channel/create",
    method: "post",
    data: qs.stringify(query)
  });
}
//  根据通道编号、主机ID查询通道（编号唯一）
export function findByCode(code, hostId) {
  return request({
    url: "/channel/findByCode",
    method: "get",
    params: {
      code,
      hostId
    }
  });
}

// 获取通道列表（级联查询）
export function findListChannel(hostId) {
  return request({
    url: "/channel/findList",
    method: "get",
    params: {
      hostId
    }
  });
}

// 获取通道下数据
export function findChannelData(id) {
  return request({
    url: "/channel/findChannelData",
    method: "get",
    params: {
      id
    }
  });
}
