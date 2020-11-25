import request from '@/utils/request'
import qs from 'qs'
// /log/getPage  关键字分页获取日志
export function getPagelog(obj) {
  return request({
    url: '/log/getPage',
    method: 'get',
    params: obj
  })
}
