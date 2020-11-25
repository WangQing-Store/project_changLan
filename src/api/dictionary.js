import request from '@/utils/request'

// /dict/getByKey 根据键获取字典列表
export function getByKey(key) {
  return request({
    url: '/dict/getByKey',
    method: 'get',
    params: {
      key
    }
  })
}
