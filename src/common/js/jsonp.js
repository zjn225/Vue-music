import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  //判断url是否有？，有的话后面加&，没有的话加？
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // console.log(url.indexOf('?') < 0 ? '?' : '&');  //&
  // console.log(param(data));  //g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)  //这个resolve是就相当于then后执行的
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''  //把第一个&去掉
}
