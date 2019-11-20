// pages/main/index.js
var loginServer = require('../../utils/loginServer');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: loginServer + '/sso/mobileLogin?redirectUrl=' + loginServer + '/sso/oauth/authorize?response_type=token&client_id=mobilelogin&redirect_uri=' + loginServer +'/sso/pages/callback/mp.html?path=/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token_time = wx.getStorageSync('token_time');
    let now_time = new Date().getTime();
    console.log('betwn_time', now_time - token_time)
    if (token_time && now_time - token_time<518400000){
     
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },
})