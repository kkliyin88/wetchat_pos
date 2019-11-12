// pages/logout/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url1: 'https://oauth.pureh2b.com/sso/mobile/invalid?',
    url2:'http://oauth.pureh2b.com/sso/oauth/authorize?response_type=token&client_id=mobilelogin&redirect_uri=https://oauth.pureh2b.com/sso/pages/callback/mp.html?path=/pages/index/index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    let url2 = encodeURIComponent(this.data.url2)
    let url = this.data.url1 + 'redirectUrl='+ url2 + '&access_token=' + token;
    console.log('退出登录',url)
   this.setData({
     url: url
   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})