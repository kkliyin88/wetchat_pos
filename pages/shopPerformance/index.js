import {
  http
} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    dateTypeList: [{
      "id": "1",
      "text": '当天',
      "value": "1",
    }, {
      "id": "2",
      "value": "2",
      "text": '本周'
    },
    {
      "id": "3",
      "value": "3",
      "text": '本月'
    }
    ],
    query: {
      regionCode: '',
      dateType: '3',
      pageNum:1,
      pageSize: 10,
    },
  },
  gotoPersonPerform(e){
    console.log('触发了点击事件')
    console.log('e',e);
    wx.navigateTo({
      url: '/pages/personPerform/index?storeCode=' + e.target.dataset.storeCode + '&storeName=' + e.target.dataset.storeName
    })
  },
  getPageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getStoreSalesPerformancePage',
      data: this.data.query
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      console.log('res', res)
      wx.hideLoading()
      if (res.data.code == 200) {
       
        this.setData({
          pageData: res.data.data.list
        })
        console.log('pageData', this.data.pageData);
      }
    }).catch((err) => {
      wx.hideLoading()
      console.log('err'.err)
    })
  },
  goback() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})