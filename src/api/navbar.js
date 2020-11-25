import request from '@/utils/request'
import qs from 'qs'
// /sysUser/isUpdatePwd  用户密码是否六个月未修改(返回boolean结果,true为超过六个月没修改)
export function isUpdatePwd(userId) {
  return request({
    url: '/sysUser/isUpdatePwd',
    method: 'get',
    params:{
      userId
    }
  })
}

export function SecondaryValidation(obj) {
  return request({
    url: '/token/bindingSecret',
    method: 'post',
    data:qs.stringify(obj)
  })
}

export function SecondaryValidationURL() {
  return request({
    url: '/token/createSecretUri',
    method: 'get'
  })
}

export function removeSecret(obj) {
  return request({
    url: '/token/removeSecret',
    method: 'post',
    data:qs.stringify(obj)
  })
}
