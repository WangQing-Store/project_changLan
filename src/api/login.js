import request from '@/utils/request'
import qs from 'qs'
export function login(username, password) {
  return request({
    url: '/token/token',
    // method: 'get',
    // params: {
    //   'username': username,
    //   'password': password
    // },
    method: 'post',
    data: qs.stringify({
      'username': username,
      'password': password
    })
  })
}

export function twoLogin(obj) {
  return request({
    url: '/token/totp',
    method: 'post',
    data: qs.stringify(obj)
  })
}

export function getInfo() {
  return request({
    url: '/sysUser/info',
    method: 'get'
  })
}

export function refreshToken(oldToken) {
  return request({
    url: '/token/refreshToken',
    method: 'get',
    params: {
      'jws': oldToken
    }
  })
}

export function getDictAll() {
  return request({
    url: '/dict/findAll',
    method: 'get'
  })
}

export function getCurrentRoleType() {
  return request({
    url: '/sysRole/getRoleType',
    method: 'get'
  })
}
