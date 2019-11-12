import {
  http
} from '../../utils/http.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    areaList:[],
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
      dateType: 1,
      pageNum:1,
      pageSize: 10,
    },
  },
  gotoPersonPerform(e){
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
      wx.hideLoading()
      if (res.data.code == 200) {
        this.setData({
          pageData: res.data.data.list
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  getAreaList() {
    let that = this
    wx.getStorage({
      key: 'areaList',
      success(res) {
        that.setData({
          areaList: res.data
        })
        console.log('areaList', that.data.areaList)
      }
    })
  },
  change(targer) {
    let temp = 'query.' + targer.detail.key
    this.setData({ [temp]: targer.detail.value });
    this.getPageData();
  },
  goback() {
    wx.showToast({
      title: '返回首页',
      duration: 2000
    })
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAreaList();
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onPullDownRefresh: function () {
    this.getPageData();
  },
  
})