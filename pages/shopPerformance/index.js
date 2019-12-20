import {
  http
} from '../../utils/http.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageData: [],
    areaList:[],
	selectList:[],
	areaItem:{},
	popTitle:'',
    dateTypeList: [],
    windowHeight: '',
	popFlag:false,
	dateTypeItem:{
	 	id: "1",
	 	text: '当月',
	 	value: "2",
	 	type:'dateType'
	 },
    query: {
      regionCode: '',
      memberBrandId:'',
      dateType: 1,
      pageNum:1,
      pageSize:1000,
    }, 
	 
  },
  gotoPersonPerform(e){
    wx.redirectTo({
      url: '/pages/personPerform/index?storeCode=' + e.currentTarget.dataset.storeCode + '&storeName=' + e.currentTarget.dataset.storeName + '&dateType=' + this.data.query.dateType + '&regionCode=' + this.data.query.regionCode
    })
  },
  showPop(){
  	 this.setData({
  		 popFlag:!this.data.popFlag
  	 }) 
  },
  getPageData() {
    let params = {
      url: 'behaviorapi/mini/pos/getStoreSalesPerformancePage',
      data: this.data.query
    }
    wx.showLoading({
      title: '加载中'
    })
    http(params).then((res) => {
      wx.hideLoading()
      if (res.data.code == 200) {
        this.setData({
          pageData: res.data.data.list
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
  getAreaList() {
    let params = {
      url: 'behaviorapi/mini/fegin/listRegionAndCity',
    }
    http(params).then((res) => {
  	  console.log('res',res)
      if (res.data.code == 200) {
         res.data.data.map((item) => {
          item.text = item.regionName;
          item.value = item.regionCode;
  		   delete item.regionCode;
  		  item.type = 'area';
        })
  		let temparr = res.data.data
        temparr.unshift({
          text: '全国',
          value: '',
  		   id:'',
  		   type:'area',
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
  goback() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  getdateTypeList(){
    this.setData({
      dateTypeList: app.globalData.dateTypeList
    })
  },
  getSystemInfo(){
    this.setData({
      windowHeight: app.globalData.systemInfo.windowHeight
    })
  },
 sumitSelect(e){
 	  if(e.detail.type=='area'){
 		this.setData({
			  areaItem: e.detail,
			  'query.regionCode':e.detail.value,
 		})
 	  }else if(e.detail.type=='dateType'){
 		  this.setData({
 			 dateTypeItem: e.detail,
 			 'query.dateType':e.detail.value
 		  }) 
 	  }
 	  this.getPageData();
 },
  clickArea(){
  	  this.setData({
  	  	 selectList:this.data.areaList,
  		  popTitle:'选择区域'
  	  }) 
  	   this.showPop(); 
  },
  clickDateType(){
  	  this.setData({
  	  	 selectList:app.globalData.dateTypeList,
  	  		  popTitle:'选择时间维度'
  	  }) 
  	  this.showPop(); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.dateType){
     this.setData({
       'query.dateType': options.dateType
     })
    }
    if (options.regionCode) {
      this.setData({
        'query.regionCode': options.regionCode
      })
    }
      this.setData({
        'query.memberBrandId': app.globalData.menberBrandList[app.globalData.currentMenberBrandIndex].id
      })
    this.getdateTypeList();
    this.getAreaList();
    this.getPageData();
    this.getSystemInfo();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh(); //这句也很重要
    setTimeout(() => {
      this.getPageData();
    }, 500)
  },
})