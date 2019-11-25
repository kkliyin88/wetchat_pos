/**
 * 封装http 请求方法
 */
var server = require('./server');
const http = (params) => {
  let url = params.server ? params.server + params.url : server + params.url
  return new Promise((resolve, reject) => { //返回promise 对象
    try {
      var token = wx.getStorageSync('token');
      console.log('token', token);
      if (token) {
        wx.request({
          url: url,
          data: params.data || {},
          header: {
            Authorization: 'Bearer' + ' ' + token,
          },
          method: params.method || 'POST',
          success: function(res) {
            console.log('res_succed',res)
            resolve(res)
          },
          fail: function(e) {
            console.log('fail_e', e)
            if (e.statusCode == 401) {
              wx.navigateTo({
                url: '/pages/login/index'
              })
            }
            reject(e)
          }
        })
      }else{
        wx.navigateTo({
          url: '/pages/login/index'
        })
      }
    } catch (e) {
      wx.showToast({
        title: '获取token失败',
		    icon: 'none',
        duration: 2000
      })
    }
  })
}
module.exports = {
  http: http
}