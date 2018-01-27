import jsonp from '../common/js/jsonp'
import {commonParams, options} from "./config.js";
import axios from 'axios'

export function getRecommend() {
  const url = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"
  //浅拷贝、对象属性的合并
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  // const url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg"
  const url = '/api/getDiscList'  //在dev-server.js里代理了，因为这个url配置了同源策略
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data  //注意这里的s
  }).then((res) => {
    return Promise.resolve(res.data)  //这里的P大写
  })
}
