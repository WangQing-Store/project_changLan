import request from "@/utils/request";
import qs from "qs";

export function fetchList(query) {
  return request({
    url: "/personnel/search",
    method: "get",
    params: query
  });
}

export function search(query) {
  return request({
    url: "/personnel/search",
    method: "get",
    params: query
  });
}

export function fetchRoles() {
  return request({
    url: "/sysRole/findByType",
    method: "get"
  });
}

export function createPersonnel(data) {
  return request({
    url: "/personnel/input",
    method: "post",
    data: qs.stringify(data)
  });
}

export function updatePersonnel(data) {
  return request({
    url: "/personnel/update",
    method: "put",
    data: qs.stringify(data)
  });
}

export function deletePersonnel(data) {
  return request({
    url: "/personnel/" + data,
    method: "delete"
  });
}

export function resetPass(data) {
  return request({
    url: "/sysUser/reset",
    method: "put",
    data: qs.stringify(data)
  });
}
