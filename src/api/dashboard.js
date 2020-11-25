import request from '@/utils/request'

export function fetchAll() {
  return request({
    url: '/node/getHostNode',
    method: 'get',
  })
}

export function getByJwsAndKey(token, key) {
  return request({
    url: '/token/getByJwsAndKey',
    method: 'get',
    params: {
      'jws': token,
      'key': key
    }
  })
}
// /homePage/findList 首页信息展示
export function findList() {
  return request({
    url: '/homePage/findList',
    method: 'get',
  })
}
// /homePage/search 首页模糊搜索
export function searchHomePage(query) {
  return request({
    url: '/homePage/search',
    method: 'get',
    params:query
  })
}
export function getMapStatus() {
  return request({
    url: '/homePage/getMapStatus',
    method: 'get'
  })
}
// /homePage/getMapStatus
export const imgfileUpload  = '/homePage/imgUpload'
