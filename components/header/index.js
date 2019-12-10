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
   
    changeDateType(e) {
      let temp = this.data.condition.dateType;
      this.setData({
        'condition.dateType': this.data.condition.dateType=='1'?'2':'1'
      });
      this.triggerEvent('changeCondition', this.data.condition) //修改父组件的条件
    },
    changePlaform(e){ //选择平台
    this.getShopList(e.detail.value);
	  this.setData({
	    'condition.pttype': e.detail.value,
      'condition.werks': '',
	  });
   
	  this.triggerEvent('changeCondition', this.data.condition) //修改父组件的条件
    },
	changeShop(e){ //选择门店
	  this.setData({
	    'condition.werks': e.detail.value
	  });
	  this.triggerEvent('changeCondition', this.data.condition) //修改父组件的条件
	},
    getPlaformList() {
      let params = {
        url: 'behaviorapi/mini/sap/getZPTList',
        data:{
          platform: this.data.condition.platform
        }
      }
      http(params).then((res) => {
        if (res.data.code == 200) {
          res.data.data.list.map((item) => {
            item.text = item.zpt;
            item.value = item.pttype;
          })
          this.setData({
            plafromList: res.data.data.list
          })
        }
      }).catch((err) => {
        wx.hideLoading()
      })
    },
    getShopList(pttype) {
      let params = {
        url: 'behaviorapi/mini/sap/getZPTStoreList',
        data: {
          platform: this.data.condition.platform,
          pttype: pttype 
        }
      }
      http(params).then((res) => {
        if (res.data.code == 200) {
          res.data.data.list.map((item) => {
            item.text = item.storeName;
            item.value = item.type;
          });
		  
          this.setData({
            shopList: res.data.data.list
          })
        }
      }).catch((err) => {
        wx.hideLoading()
      })
    },
  },
  attached() {
    if(this.data.type=='dianshang'){
      this.setData({
       'condition.platform':'2'
      })
    } else if (this.data.type == 'offline'){
      this.setData({
        'condition.platform': '1'
      })
    }
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    });
    this.getPlaformList();
    this.getShopList();
  }
})