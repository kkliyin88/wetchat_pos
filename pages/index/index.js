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
    addFlag: true,
    areaList: [],
    userInfo: {},
    storeName: '',
    storeCode: '',
  },
  logout() {
    wx.redirectTo({
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

        temp.unshift({
          text: '全国',
          value: '',
          regionName: '全国'
        })
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
    onPullDownRefresh: function() {
  },
  gotoShopPerformance() {
    console.log('触发点击事件')
    wx.redirectTo({
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
    console.log('触发点击事件')
    wx.redirectTo({
      url: '/pages/personPerform/index?storeName=' + this.data.storeName + '&storeCode=' + this.data.storeCode +'&dateType=1'
    })
  },
  changePage_perform() {
    //如果是导购员直接跳转到 导购员业绩
    let roles = app.globalData.userInfo.roles
    if (roles.length < 1) {
      wx.showToast({
        title: '您没有权限查看该页面,如有需要请联系管理员!',
        duration: 2000
      })
    } else if (roles.length == 1 && roles[0].name == '店员') {
      this.gotoPersonPerform()
    } else {
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
        let manageFlag= false;
        app.globalData.userInfo.roles.map((item)=>{
          if (item.name.indexOf('高层')!=-1 || item.name.indexOf('超级')!=-1){
            manageFlag = true;
           }
        })
        if (manageFlag){
          res.data.data.unshift({
            text: '全国',
            value: '',
            regionName: '全国'
          });
        }
        wx.setStorageSync('areaList', res.data.data) //将地区设置到缓存中
      }
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getUserMsg() { //获取用户信息
    let params = {
      url: '/sso/user/info',
      server: 'http://oauth.pureh2b.com'
    }
    http(params).then((res) => {
      this.setData({
        userInfo: res.data
      })
      app.globalData.userInfo = res.data;
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
      }else{
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
  getSystemInfo(){
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.systemInfo = res;
      }
    });
    console.log('systemInfo11', app.globalData.systemInfo)
  },
  onLoad: function(options) {
    if (options.access_token) {
      wx.setStorageSync('token', options.access_token);
      wx.setStorageSync('token_type', options.token_type);
      this.getAreaList();
      this.getShopList();
      this.getUserMsg();
    }
    if (app.globalData.userInfo){
      this.setData({ userInfo: app.globalData.userInfo})
    }
    this.getSystemInfo();
    this.getPageData();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(()=>{
      this.getPageData();
    },500)
  },
})