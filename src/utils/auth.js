// import Cookies from 'js-cookie'
import { getDictAll, getCurrentRoleType } from '@/api/login'
import { getWorkFlowDict } from '@/api/alarm/untreated'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}

export function setDict() {
  getDictAll().then(response => {
    localStorage.setItem('Dict', JSON.stringify(response.data.data))
  })
}

export function setWorkFlow() {
  getWorkFlowDict('t_warning_handle').then(response => {
    localStorage.setItem('workflow', JSON.stringify(response.data.data))
  })
}

export function setRoleType() {
  getCurrentRoleType().then(response => {
    localStorage.setItem('RoleType', response.data.data.type)
  })
}

export function getRoleType() {
  return localStorage.getItem('RoleType')
}
