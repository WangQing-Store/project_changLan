import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/api/area/list',
    method: 'get'
  })
}

export function fetchAreaOptions() {
  return request({
    url: '/api/area/options',
    method: 'get'
  })
}

export function fetchRegion(query) {
  return request({
    url: '/api/region/find',
    method: 'get',
    params: query
  })
}

export function createArea(data) {
  return request({
    url: '/api/area/input',
    method: 'post',
    data
  })
}

export function updateArea(data) {
  return request({
    url: '/api/area/input',
    method: 'put',
    data
  })
}

export function deleteArea(data) {
  return request({
    url: '/api/area/' + data,
    method: 'delete'
  })
}

export function searchArea(query) {
  return request({
    url: '/api/area/search',
    method: 'get',
    params: query
  })
}
