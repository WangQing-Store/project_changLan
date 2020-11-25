import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/unit/getAll',
    method: 'get',
    params: query
  })
}

export function search(query) {
  return request({
    url: '/unit/search',
    method: 'get',
    params: query
  })
}

export function fetchHost() {
  return request({
    url: '/host/list',
    method: 'get'
  })
}

export function fetchNode(data) {
  return request({
    url: '/node/' + data,
    method: 'get'
  })
}

export function getAll() {
  return request({
    url: '/unitNode/getAll',
    method: 'get'
  })
}

export function findByUnit(data) {
  return request({
    url: '/unitNode/' + data,
    method: 'get'
  })
}

export function getHostNode(query) {
  return request({
    url: '/host/getHostNode/' + query,
    method: 'get'
  })
}

export function addDelUnitNode(data) {
  return request({
    url: '/unitNode/adddel',
    method: 'post',
    data
  })
}
