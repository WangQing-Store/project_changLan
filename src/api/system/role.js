import request from '@/utils/request'
import Layout from '@/views/layout/Layout'

export function fetchList(query) {
  return request({
    url: '/sysRole/search',
    method: 'get',
    params: query
  })
}

export function createRole(query) {
  return request({
    url: '/sysRole/create',
    method: 'post',
    params: query
  })
}


export function deleteRole(data) {
  return request({
    url: '/sysRole/' + data,
    method: 'delete'
  })
}

export function search(query) {
  return request({
    url: '/sysRole/search',
    method: 'get',
    params: query
  })
}

export function fetchModule(data) {
  return request({
    url: '/sysRoleModule/' + data,
    method: 'get'
  })
}

export function fetchTree() {
  return request({
    url: '/sysModule/getTree',
    method: 'get'
  })
}
// /roleModule/getRoleModule 根据角色ID获取模块
export function getRoleModule(roleId) {
  return request({
    url: '/roleModule/getRoleModule',
    method: 'get',
    params: {
      roleId
    }
  })
}

// /sysModule/getModule 获取所有模块
export function getAllModule() {
  return request({
    url: '/sysModule/getModule',
    method: 'get'
  })
}
// /sysRole/addRole 添加角色
export function addRole(query) {
  return request({
    url: '/sysRole/addRole',
    method: 'post',
    params: query
  })
}

export function getSide() {
  return request({
    url: '/sysModule/getSide',
    method: 'get'
  })
}

export function updateEnable(data) {
  return request({
    url: '/sysRole/' + data,
    method: 'put'
  })
}

// export function addDelModule(data) {
//   return request({
//     url: '/sysRoleModule/adddel',
//     method: 'post',
//     data
//   })
// }
// /sysRole/isEnable isEnable
export function sysRoleIsEnable(roleId) {  //更新是否启用
  return request({
    url: '/sysRole/isEnable',
    method: 'put',
    params:{
      roleId
    }
  })
}
export function updateRole(query) {  //更新角色
  return request({
    url: '/sysRole/updateRole',
    method: 'put',
    params:query
  })
}

// /roleModule/adddel 添加/删除角色模块(只传树子节点ID)
export function addDelModule(data) {
  return request({
    url: '/roleModule/adddel',
    method: 'post',
    data
  })
}

export function generaMenu(routers, data) {
  data.forEach((item) => {
    const menu = {
      path: item.href,
      component: item.component == 'Layout' ? Layout : () => import('@/views' + item.component + '/index'),
      children: [],
      meta: { title: item.name, id: item.id, icon: item.icon }
    }
    if (item.children && item.children[0].href!="editable") {
      generaMenu(menu.children, item.children)
    }
    routers.push(menu)
  })
  // console.log(data)
}

