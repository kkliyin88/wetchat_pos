// components/header/index.js
var loginServer = require('../../utils/loginServer');
const app = getApp()
var format = require('../../utils/format');
import {
  http
} from '../../utils/http.js';
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'zongti'
    },
    contentList:{
      type: Array,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 20,
    plafromList: [],
    shopList: [],
    condition: {
      dateType: '2',
      pttype: '', //电商中的平台母婴 电商服装 官网店铺
      werks: '',  //店铺
      platform:2, //实体 电商
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    },
   
    
  },
  attached() {
    
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    });
   
  }
})