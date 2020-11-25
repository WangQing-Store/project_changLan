import request from '@/utils/request'

// /sysUser/getEnableRole
export function getEnableRoles() {
  return request({
    url: '/sysUser/getEnableRole',
    method: 'get'
  })
}

export function createUser(query) {
  return request({
    url: '/sysUser/addUser',
    method: 'post',
    params:query
  })
}

export function getRole() {
  return request({
    url: '/sysRole/getRole',
    method: 'get',
  })
}

export function updateEnable(userId) {
  return request({
    url: '/sysUser/enableUser',
    method: 'put',
    params:{
      userId
    }
  })
}

export function fetchListUser(query) {
  return request({
    url: '/sysUser/search',
    method: 'get',
    params: query
  })
}


export function resetPass(query) {
  return request({
    url: '/sysUser/reset',
    method: 'put',
    params:query
  })
}

export function updatePwd(data) {
  return request({
    url: '/sysUser/updatePwd',
    method: 'put',
    params: data
  })
}

export function checkRepeat(username) {
  return request({
    url: "/sysUser/checkRepeat",
    method: 'get',
    params:{
      username
    }
  })
}
// /sysUser/resetPassword
export function resetPassword(userId) {
  return request({
    url: '/sysUser/resetPassword',
    method: 'put',
    params: {
      userId
    }
  })
}
export function updateUser(data) {
  return request({
    url: '/sysUser/updateUser',
    method: 'put',
    params: data
  })
}
// /sysUser/updateUser

// /sysUser/getUnit
export function getUnit() {
  return request({
    url: '/sysUser/getUnit',
    method: 'get'
  })
}
