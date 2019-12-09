// Componet/Componet.js
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
  properties: {
    
  },
  /**
   * 组件的初始数据
   */
  data: {
     list:[],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getPlaformList() {
      let params = {
        url: '/behaviorapi/mini/sap/getZPTList',
      }
      http(params).then((res) => {
       if(res.data.code==200){
         let list = res.data.data.list.map((item)=>{
           item.text = item.zpt;
           item.value = item.type;
         })
         this.setData({
           list:res.data.data.list
         })
       }
      }).catch((err) => {
        wx.hideLoading()
      })
    },
    change(e){
      console.log('e',e);
      this.triggerEvent('change') //修改父组件的条件
    }
  },
  attached() {
     // 默认选项
    this.getPlaformList();
  }
})