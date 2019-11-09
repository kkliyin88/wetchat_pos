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
    userInfo: {},
    storeName:'',
    storeCode:'',
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
  },
  logout() {
    wx.navigateTo({
      url: '/pages/logout/index'
    })
  },
    getAreaList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        let temparr = res.data.data.map((item) => {
          item.text = item.regionName;
          item.value = item.regionCode;
        })
        temp.unshift({ text: '全国', value: '', regionName:'全国'})
        console.log('temp', temp)
        this.setData({
          areaList: temparr
        })
        return
      }
    }).catch((err) => {
      console.log('err'.err)
    })
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
  },
  
  gotoShopPerformance() {
    // this.getShopList()
    console.log('storeName2222',this.data.storeName);
    wx.navigateTo({
      url: '/pages/shopPerformance/index'
    })
  },
  getShopList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listStore',
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        this.setData({
          storeName: res.data.data[0].storeName,
          storeCode: res.data.data[0].storeCode
        });
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  gotoPersonPerform() {
    wx.navigateTo({
      url: '/pages/personPerform/index?storeName=' + this.data.storeName +'&storeCode=' + this.data.storeCode
    })
  },
  changePage_perform(){ 
         //如果是导购员直接跳转到 导购员业绩
    let roles = app.globalData.userInfo.roles
    if (roles.length<1){
      wx.showToast({
        title: '您没有权限查看该页面,如有需要请联系管理员!',
        duration: 2000
      })
    } else if (roles.length == 1 && roles[0].name=='店员'){
     this.gotoPersonPerform() 
    }else {
      this.gotoShopPerformance();
    }
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
         res.data.data.map((item) => {
          item.text = item.regionName;
          item.value = item.regionCode
        })
        res.data.data.unshift({ text: '全国', value: '', regionName:'全国'});
        wx.setStorageSync('areaList', res.data.data) //将地区设置到缓存中
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getUserMsg() { //获取用户信息
    let params = {
      url: '/sso/user/info',
      server: 'http://oauth-test.pureh2b.com'
    }
    http(params).then((res) => {
      this.setData({
        userInfo: res.data
      })
      app.globalData.userInfo = res.data;
      // wx.setStorageSync('userInfo', res.data)
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
    if (options.access_token){
      wx.setStorageSync('token', options.access_token);
      wx.setStorageSync('token_type', options.token_type);
    }
    this.getUserMsg();
    this.getPageData();
    this.getAreaList();
    this.getShopList();
  }
})