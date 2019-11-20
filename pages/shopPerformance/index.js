import {
  http
} from '../../utils/http.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    areaList:[],
    dateTypeList: [],
    windowHeight: '',
    query: {
      regionCode: '',
      memberBrandId:'',
      dateType: 1,
      pageNum:1,
      pageSize:200,
    },       
  },
  gotoPersonPerform(e){
    wx.redirectTo({
      url: '/pages/personPerform/index?storeCode=' + e.currentTarget.dataset.storeCode + '&storeName=' + e.currentTarget.dataset.storeName + '&dateType=' + this.data.query.dateType + '&regionCode=' + this.data.query.regionCode
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
      }
    })
  },
  change(targer) {
    let temp = 'query.' + targer.detail.key
    this.setData({ [temp]: targer.detail.value });
    this.getPageData();
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  getdateTypeList(){
    this.setData({
      dateTypeList: app.globalData.dateTypeList
    })
  },
  getSystemInfo(){
    this.setData({
      windowHeight: app.globalData.systemInfo.windowHeight
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log('menberBrandList',app.globalData.menberBrandList);
    console.log('currentMenberBrandIndex', app.globalData.currentMenberBrandIndex)
    if (options.dateType){
     this.setData({
       'query.dateType': options.dateType
     })
    }
    if (options.regionCode) {
      this.setData({
        'query.regionCode': options.regionCode
      })
    }
      this.setData({
        'query.memberBrandId': app.globalData.menberBrandList[app.globalData.currentMenberBrandIndex].id
      })
    this.getdateTypeList();
    this.getAreaList();
    this.getPageData();
    this.getSystemInfo();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
})