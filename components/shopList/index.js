// Componet/Componet.js
import {
  http
} from '../../utils/http.js';
var loginServer = require('../../utils/loginServer');
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
     
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getShopList() {
      let params = {
        url: '/behaviorapi/mini/fegin/listByDicCode?dicCode=1003',
      }
      http(params).then((res) => {
       
      }).catch((err) => {
        wx.hideLoading()
      })
    },
  },
  attached() {
     // 默认选项
   
  }
})