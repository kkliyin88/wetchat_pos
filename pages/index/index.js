//index.js
//获取应用实例
var loginServer = require('../../utils/loginServer');
const app = getApp()
var format = require('../../utils/format');
import {
  http
} from '../../utils/http.js';
Page({
  data: {
    pageData: {
      netSalesAmt: ''
    },
    addFlag: true,
    areaList: [],
    userInfo: {},
    storeName: '',
    storeCode: '',
    titie: '',
    listAll: [],
    rollCssArr: [],
    menberBrandList: [],
    currentIndex: 0,
    time: '',
    actualData: [],
    swiperParams: {
      indicatorDots: true,
      autoplay: false,
      interval: 3000,
      duration: 500,
      vertical: true,
      current: 0,
      indicatorcolor: '#9EA8FF',
      indicatoractivecolor: '#C1C7FA'
    }
  },
  logout() {
    wx.clearStorageSync('token_time')
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
    let roles = app.globalData.userInfo.roles
    if (roles.length < 1 || (roles.length == 1 && roles[0].name == '店员')) {
      wx.showToast({
        title: '您没有权限查看该页面,如有需要请联系管理员!',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.redirectTo({
      url: '/pages/top/index'
    })
  },
  changIcon() {
    this.setData({
      addFlag: !this.data.addFlag
    });
  },
  gotoShopPerformance() {
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
    wx.redirectTo({
      url: '/pages/personPerform/index?storeName=' + this.data.storeName + '&storeCode=' + this.data.storeCode + '&dateType=1'
    })
  },
  changePage_perform() {
    let roles = app.globalData.userInfo.roles
    if (roles.length < 1) {
      wx.showToast({
        title: '您没有权限查看该页面,如有需要请联系管理员!',
        icon: 'none',
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
      icon: 'none',
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
        let manageFlag = false;
        app.globalData.userInfo.roles.map((item) => {
          if (item.name.indexOf('高层') != -1 || item.name.indexOf('超级') != -1 || item.name.indexOf('Superman') != -1) {
            manageFlag = true;
          }
        })
        if (manageFlag) {
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
      server: loginServer
    }
    http(params).then((res) => {
      this.setData({
        userInfo: res.data
      })
      app.globalData.userInfo = res.data;
      app.globalData.userInfo.roles.map((item) => { //高层才能看品牌
        if (item.name.indexOf('高层') != -1 || item.name.indexOf('超级') != -1 || item.name.indexOf('Superman') != -1) {
          this.getMenberList();
        } else {
          this.setData({
            menberBrandList: [{
              id: '',
              desc: '今日销售额'
            }]
          })
          app.globalData.currentMenberBrandIndex = 0;
          app.globalData.menberBrandList = [{
            id: '',
            desc: '今日销售额'
          }]
        }
      })
    }).catch((err) => {
      console.log('err'.err)
    })
  },
  getPageData(e) {
    if (e) {
      app.globalData.currentMenberBrandIndex = e.detail.current
    }
    let params = {
      url: 'behaviorapi/mini/pos/getStoreSalesDayInfo',
      data: {
        memberBrandId: app.globalData.menberBrandList[app.globalData.currentMenberBrandIndex].id
      }
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        
        let listInit = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let prevArray = [4, 8, 9] //this.data.pageData.netSalesAmt.toString().split("")
        console.log('prevArray', prevArray);
        let nextArray = [6,8,8] //res.data.data.netSalesAmt.toString().split("")
        console.log('nextArray', nextArray);
        let listAll = [];
        for (let i = 0; i < nextArray.length; i++) {
          let prevNumber = prevArray[i];
          let nextNumber = nextArray[i];
          let start = -1;
          let end = -1;
          for (let j = 0; j < listInit.length; j++) {
            if (listInit[j] === prevNumber) {
              start = j;
            }
            if (prevArray[i] - nextArray[i] > 0) {
              end = j;
            }
            if (start !== -1 && listInit[j] === nextNumber) {
              end = j;
              break;
            }
          }
          listAll.push(listInit.slice(start, end + 1));
        }
        console.log('listAll', listAll);
        this.setData({
          pageData: res.data.data,
          listAll: listAll
        });
        cosole.log('pageData',this.data.pageData)
        return
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
  getSystemInfo() {
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.systemInfo = res;
      }
    });
  },
  getMenberList() {
    let params = {
      url: '/behaviorapi/mini/fegin/listByDicCode?dicCode=1003',
    }
    http(params).then((res) => {
      if (res.data.code == 200) {
        let result = res.data.data.filter((item) => {
          return item.id !== 534 //过滤稳健医疗
        })
        app.globalData.menberBrandList = [{
          id: '',
          desc: '今日销售额'
        }, ...result]
        this.setData({
          menberBrandList: app.globalData.menberBrandList
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
  onLoad: function(options) {
    if (options.access_token) {
      wx.setStorageSync('token', options.access_token);
      wx.setStorageSync('token_type', options.token_type);
      wx.setStorageSync('token_time', new Date().getTime());
    }
    app.globalData.currentMenberBrandIndex = 0
    this.getUserMsg();
    this.getAreaList();
    this.getShopList();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    this.getSystemInfo();
    this.getPageData();
  },
  onReady() {
    this.setData({
      time: setInterval(() => {
        this.getPageData();
      }, 3000)
    })
  },
  onUnload() {
    clearInterval(this.data.time);
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
      this.getUserMsg();
    }, 500)
  },
})