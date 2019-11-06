//index.js
//获取应用实例
const app = getApp()
var format = require('../../utils/format');
import { http } from '../../utils/http.js';
Page({
  data: {
    pageData: {},
  },

  gototop() {
    wx.navigateTo({
      url: '/pages/top/index'
    })
  },
  getArea() {
    let params = {
      url: '/api/mdm/region/pageRegionCity',
    }
    http(params).then((res) => {
    }).catch((err) => {
      console.log('err'.err)
    })

  },
  getUserMsg() {
    let params = {
      url: '/sso/user/info',
      server: 'http://oauth-test.pureh2b.com'
    }
    http(params).then((res) => {
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getPageData() {
    let params = {
      url: '/behaviorapi/mini/pos/getStoreSalesDayInfo',
      data: {}

    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        this.setData({ pageData: res.data.data })
        return
      }
    }).catch((err) => {
      wx.hideLoading()
    })
  },
  onLoad: function (options) {
    wx.setStorageSync('token', options.access_token)
    console.log('token=', options.access_token)
    wx.setStorageSync('token_type', options.token_type)
    this.getUserMsg();
    this.getArea();
    this.getPageData();
  }

})
