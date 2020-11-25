import request from "@/utils/request";

//  根据通道ID获取温度历史数据时间
export function getDate(channelId) {
  return request({
    url: "/tempHistory/getDate",
    method: "get",
    params: {
      channelId
    }
  });
}

//  根据通道ID、时间获取历史温度数据
export function getHistory(channelId, createTime) {
  return request({
    url: "/tempHistory/getHistory",
    method: "get",
    params: {
      channelId,
      createTime
    }
  });
}
