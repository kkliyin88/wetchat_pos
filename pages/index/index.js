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
      netSalesAmt: 0
    },
    addFlag: false,
    areaList: [],
    userInfo: {},
    storeName: '',
    storeCode: '',
    titie: '',
    listAll: [],
    menberBrandList: [],
    statusBarHeight:0,
    currentIndex: 0,
    time: '',
    actualData: [],
    swiperParams: {
      indicatorDots: true,
      autoplay: false,
      vertical: true,
      current: 0,
      indicatorcolor: '#9EA8FF',
      indicatoractivecolor: '#C1C7FA'
    }
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
    let roles = app.globalData.userInfo.roles
    if (app.globalData.roleLevel == 3) {
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
   changeswiper(e){
     this.getPageData(e);
      setTimeout(()=>{
        this.getPageData(e);
      },300)
   },
  getShopList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listStore',
    };
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
	  if(app.globalData.roleLevel>2){
		  wx.showToast({
		    title: '您没有权限进入该页面,如需要请联系管理人员!',
		    icon: 'none',
		    duration:2000
		  })
		  return 
	  }
	  wx.switchTab({url:'/pages/zongti/index'})
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
        if (app.globalData.roleLevel==1) {
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
  getUserInfo() { //获取用户信息
    let params = {
      url: '/sso/user/info',
      server: loginServer
    }
    http(params).then((res) => {
      
      this.setData({
        userInfo: res.data
      })
      app.globalData.userInfo = res.data;
      //设置全局的权限

      let roleStr= ''
      app.globalData.userInfo.roles.map((item)=>{
        roleStr = roleStr + item.name
      })
      if (roleStr.indexOf('超级') != -1 || roleStr.indexOf('高层') != -1 || roleStr.indexOf('Superman') != -1){
        app.globalData.roleLevel = 1;
      } else if (roleStr.indexOf('区域') != -1 || roleStr.indexOf('经理') != -1){
        app.globalData.roleLevel = 2;
      } else if (roleStr.indexOf('店员') != -1 || roleStr.indexOf('导购') != -1){
        app.globalData.roleLevel = 3;
      }else{
        app.globalData.roleLevel = 4;
      }
      if (app.globalData.roleLevel==1){
        this.getMenberList();
      }else{
        this.setData({
          menberBrandList: [{
            id: '',
            desc: '今日销售额'
          }]
        })
        app.globalData.menberBrandList = [{
          id: '',
          desc: '今日销售额'
        }]
      }
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
        let prevArray0 = this.data.pageData.netSalesAmt.toFixed(2)
        let prevArray = prevArray0.toString().split("")
        let nextArray0 = res.data.data.netSalesAmt.toFixed(2); 
        let nextArray = nextArray0.toString().split("")

        if (nextArray.length > prevArray.length) {
          let temp = nextArray.length - prevArray.length
          let filterarr = new Array(temp).fill('0')
          prevArray.splice(0, 0, ...filterarr)
        } else if (nextArray.length < prevArray.length){
          let temp = prevArray.length - nextArray.length
          let filterarr = new Array(temp).fill('0')
          nextArray.splice(0, 0, ...filterarr)
        }
        let listAll = [];
        for (let i = 0; i < nextArray.length; i++) {
          let prevNumber = Number(prevArray[i]);
          let nextNumber = Number(nextArray[i]);
          let start = -1;
          let end = -1;
          for (let j = 0; j < listInit.length; j++) {
            if (listInit[j] === prevNumber) {
              start = j;
            }
            if (start !== -1 && listInit[j] === nextNumber) {
              end = j;
              break;
            }
          }
          listAll.push(listInit.slice(start, end + 1));
        }
        this.setData({
          pageData: res.data.data,
          listAll: listAll,
        });
        return
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 5000
        })
      }
    }).catch((err) => {
      console.log('err', err)
      wx.hideLoading()
    })
  },
  getSystemInfo() {
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.systemInfo = res;
      }
    });
    this.setData({
      statusBarHeight: app.globalData.systemInfo.statusBarHeight
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
      app.globalData.token = options.access_token;
      app.globalData.token_type = options.token_type;
    }
    app.globalData.currentMenberBrandIndex = 0
    this.getUserInfo();
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
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
  onUnload() {
    clearInterval(this.data.time);
  },
  
})