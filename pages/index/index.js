//index.js
//获取应用实例
const app = getApp()
var format = require('../../utils/format');
import {
  http
} from '../../utils/http.js';
Page({
  data: {
    pageData: {},
    addFlag: false,
    areaList: [],
    userInfo:{}
  },
  
  gototop() {
    wx.navigateTo({
      url: '/pages/top/index'
    })
  },
  changIcon() {
    this.setData({
      addFlag: !this.data.addFlag
    });
    console.log('addFlag', this.data.addFlag)
  },
  gotoSale() {
    wx.showToast({
      title: '页面即将跳转',
      duration: 1000
    })
    wx.navigateTo({
      url: '/pages/shopPerformance/index'
    })

  },
  gotoProfit() {
    wx.showToast({
      title: '页面待开发',
      duration: 2000
    })
  },
  getAreaList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        let temparr = res.data.data.map((item) => {
          item.text = item.regionName
        })
        wx.setStorageSync('areaList', res.data.data) //将地区设置到缓存中
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getUserMsg() {  //获取用户信息
    let params = {
      url: '/sso/user/info',
      server: 'http://oauth-test.pureh2b.com'
    }
    http(params).then((res) => {
      console.log('user_info',res)
      this.setData({ userInfo: res.data})
      wx.setStorageSync('userInfo', res.data)

    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getPageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getStoreSalesDayInfo',
      data: {}
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        this.setData({
          pageData: res.data.data
        })
        return
      }
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  onLoad: function(options) {
    console.log('options', options)
    wx.setStorageSync('token', options.access_token)
    wx.setStorageSync('token_type', options.token_type);
    this.getUserMsg();
    this.getPageData();
    this.getAreaList();
  }

})