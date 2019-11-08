/**
 * 封装http 请求方法
 */
var server = require('./server');
var token = wx.getStorageSync('token');
var token_type = wx.getStorageSync('token_type');
const http = (params) => {
  let url = params.server ? params.server + params.url:server + params.url
  return new Promise((resolve, reject) => { //返回promise 对象
    wx.request({
      url:url,
      data: params.data||{},
      header: {
        Authorization: 'Bearer'+ ' '+ wx.getStorageSync('token'),
      },
      method: params.method || 'POST',
      success: function (res) {
        if (res.statusCode==401){
          wx.navigateTo({
            url: '/pages/login/index'
          })
         }
          resolve(res)
      },
      fail: function (e) {
        reject(e)
      }
    })
  })
}
module.exports = {
  http: http
}