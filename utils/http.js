/**
 * 封装http 请求方法
 */
var server = require('./server');
const http = (params) => {
  let url = params.server ? params.server + params.url : server + params.url
  return new Promise((resolve, reject) => { //返回promise 对象
    try {
      var token = wx.getStorageSync('token');
      if (token) {
        wx.request({
          url: url,
          data: params.data || {},
          header: {
            Authorization: 'Bearer' + ' ' + token,
          },
          method: params.method || 'POST',
          success: function(res) {
            if (res.statusCode == 401 && getCurrentPages().slice(-1)[0].route !='pages/login/index') {
              wx.navigateTo({
                url: '/pages/login/index'
              })
            }
            resolve(res)
          },
          fail: function(e) {
            
            reject(e)
          }
        })
      }else{
        if (getCurrentPages().slice(-1)[0].route != 'pages/login/index'){
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
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