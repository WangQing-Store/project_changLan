import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/disarmLog/findByPage',
    method: 'get',
    params: query
  })
}

export function fetchAllHost() {
  return request({
    url: '/host/list',
    method: 'get'
  })
}

export function search(query) {
  return request({
    url: '/disarmLog/search',
    method: 'get',
    params: query
  })
}

export function fetchDict(data) {
  return request({
    url: '/dict/getByKey/' + data,
    method: 'get'
  })
}
