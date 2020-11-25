import request from '@/utils/request'
// /host/findList 获取主机列表（根据单位）
export function getListHosts() {
  return request({
    url: '/host/findList',
    method: 'get',
  })
}
// /host/findTempHost 获取测温主机列表
export function findTempHost() {
  return request({
    url: '/host/findTempHost',
    method: 'get',
  })
}

// 根据主机id获取通道列表
export function getChannelFindList(id) {
  return request({
    url: "/channel/findList",
    method: "get",
    params: {
      hostId:id
    }
  })
}

// 获取报警详情
export function warningDetails(id) {
  return request({
    url: "warning/details",
    method: "get",
    params: {
      warningId:id
    }
  })
} 
