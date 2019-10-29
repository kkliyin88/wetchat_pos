// pages/home/index.js
var format = require('../../utils/format');
var server = require('../../utils/server');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    pageData: 123,
  },

    getPageData(){
      var that = this;
     wx.request({
       url: server+'/behaviorapi/pos/store/getStoreSalesDayReport',
       data: {
         beginDay: format.formatDate(new Date()),
         endDay: format.formatDate(new Date()),
       },
       method:"POST",
       success(res) {
		   if(res.data.code ==200){
			    console.log(res.data.data.list);  
         that.setData({pageData:res.data.data.list[res.data.data.list.length-1]})
				// this.pageData = res.data;
         console.log('pageData',that.data.pageData);  
		   }
      
		
       }
     })
   },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPageData();
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